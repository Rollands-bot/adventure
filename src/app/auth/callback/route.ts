import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | undefined;
  let profilePhone: string | null | undefined;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, phone")
      .eq("id", user.id)
      .single();
    role = (profile as { role?: string; phone?: string | null } | null)?.role;
    profilePhone = (profile as { phone?: string | null } | null)?.phone;
  }

  // Google OAuth signups don't carry a phone number, and the register
  // form requires one. Funnel anyone whose profile is missing a phone
  // through /complete-profile so they finish setup before we drop them
  // into the regular destination.
  if (user && !profilePhone) {
    const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
    const finalResponse = NextResponse.redirect(
      new URL(`/complete-profile${nextParam}`, origin),
    );
    response.cookies.getAll().forEach((c) => {
      finalResponse.cookies.set(c);
    });
    return finalResponse;
  }

  const isAdmin = role === "super_admin" || role === "staff";
  const safeNext =
    next && next.startsWith("/admin") && !isAdmin ? null : next;
  const destination = safeNext ?? (isAdmin ? "/admin" : "/produk");

  const finalResponse = NextResponse.redirect(new URL(destination, origin));
  response.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c);
  });
  return finalResponse;
}
