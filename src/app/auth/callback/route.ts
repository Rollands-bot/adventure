import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

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

  // Caller can override destination via ?next=...
  let destination = next ?? "/dashboard";

  // Otherwise route by role + device. Admins always land in /admin;
  // regular users go to /produk on phones (where they're more likely
  // browsing) and /dashboard on desktop.
  if (!next) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const role = (profile as { role?: string } | null)?.role;
      const isMobile = /Mobi/i.test(request.headers.get("user-agent") ?? "");

      if (role === "super_admin" || role === "staff") {
        destination = "/admin";
      } else if (isMobile) {
        destination = "/produk";
      } else {
        destination = "/dashboard";
      }
    }
  }

  // Rebuild response at final destination, preserving cookies set above.
  const finalResponse = NextResponse.redirect(new URL(destination, origin));
  response.cookies.getAll().forEach((c) => {
    finalResponse.cookies.set(c);
  });
  return finalResponse;
}
