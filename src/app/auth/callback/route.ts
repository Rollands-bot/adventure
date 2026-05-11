import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const isSafeNext = (value: string | null): value is string =>
  !!value && /^\/[^/]/.test(value);

// A user is treated as "not registered" if their auth row was created
// within this window AND their profile has no phone — the register form
// always collects a phone, so a phoneless fresh row means they came in
// via Google OAuth without going through /register.
const FRESH_SIGNUP_WINDOW_MS = 5 * 60 * 1000;

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

  // Block Google OAuth users who never went through /register. A row
  // freshly created via OAuth has no phone (the trigger only fills phone
  // when raw_user_meta_data.phone is set, which the register magic-link
  // flow provides). We bound this to a small time window so older users
  // who happen to have NULL phone aren't kicked out.
  const createdAtMs = user?.created_at ? new Date(user.created_at).getTime() : 0;
  const isFresh = createdAtMs > 0 && Date.now() - createdAtMs < FRESH_SIGNUP_WINDOW_MS;
  const isUnregisteredOAuth = user && isFresh && !profilePhone && role === "user";

  if (isUnregisteredOAuth) {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      const admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceKey,
        { auth: { persistSession: false, autoRefreshToken: false } },
      );
      // Cascades through FK to delete the just-created profile row too.
      await admin.auth.admin.deleteUser(user.id);
    }
    await supabase.auth.signOut();
    const email = user.email ? `&email=${encodeURIComponent(user.email)}` : "";
    const rejectResponse = NextResponse.redirect(
      new URL(`/register?error=not_registered${email}`, origin),
    );
    // Carry the cleared auth cookies so the browser drops the session.
    response.cookies.getAll().forEach((c) => {
      rejectResponse.cookies.set(c);
    });
    return rejectResponse;
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
