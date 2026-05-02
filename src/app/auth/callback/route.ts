import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Only allow same-origin redirects, single leading slash. Rejects
// "//evil.com", "https://evil.com", and anything not starting with "/".
const isSafeNext = (value: string | null): value is string =>
  !!value && /^\/[^/]/.test(value);

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");
  const next = isSafeNext(rawNext) ? rawNext : null;

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", origin));
  }

  // We need a mutable response so cookies set during exchange persist
  // through the eventual redirect.
  let response = NextResponse.redirect(new URL("/dashboard", origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: "", ...options });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=exchange", origin));
  }

  // Resolve role first so we can guard `next` against admin pages.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let role: string | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = (profile as { role?: string } | null)?.role;
  }
  const isAdmin = role === "super_admin" || role === "staff";

  // If caller asked for /admin but the user isn't admin, drop the next
  // hint to avoid the middleware bouncing them right back to /login.
  const safeNext =
    next && next.startsWith("/admin") && !isAdmin ? null : next;

  const destination =
    safeNext ?? (isAdmin ? "/admin" : "/produk");

  // Rebuild response at final destination, preserving cookies set above.
  const finalResponse = NextResponse.redirect(new URL(destination, origin));
  response.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c);
  });
  return finalResponse;
}
