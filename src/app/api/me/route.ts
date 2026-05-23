import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

// Returns the authenticated user's profile by reading their session
// from cookies and then fetching via service role. We do this server-
// side because the browser-side query against `profiles` has been
// observed to time out or hit lock contention in supabase-js, leaving
// admins stuck with role=undefined and a "Dashboard" link instead of
// "Admin Panel". The session check here still uses the user's JWT, so
// callers cannot read someone else's profile.
export async function GET(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(_name: string, _value: string, _options: CookieOptions) {},
        remove(_name: string, _options: CookieOptions) {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ profile: null }, { status: 401 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { profile: null, error: "service_role_missing" },
      { status: 500 },
    );
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data: profile, error } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { profile: null, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { profile },
    {
      headers: { "Cache-Control": "private, no-store" },
    },
  );
}
