import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { signToken } from "@/lib/admin-tokens";

export async function POST(req: NextRequest) {
  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body harus JSON valid" }, { status: 400 });
  }

  const { orderId } = body;
  if (!orderId || typeof orderId !== "string") {
    return NextResponse.json({ error: "orderId diperlukan" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {},
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Harus login" }, { status: 401 });
  }

  const { data: order, error: orderErr } = await supabase
    .from("orders")
    .select("id, user_id")
    .eq("id", orderId)
    .single();

  if (orderErr || !order || order.user_id !== user.id) {
    return NextResponse.json({ error: "Order tidak ditemukan atau bukan milikmu" }, { status: 403 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

  try {
    const confirmToken = signToken(orderId, "confirm");
    const rejectToken = signToken(orderId, "reject");

    return NextResponse.json({
      confirmUrl: `${baseUrl}/api/orders/action?id=${orderId}&do=confirm&token=${confirmToken}`,
      rejectUrl: `${baseUrl}/api/orders/action?id=${orderId}&do=reject&token=${rejectToken}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Server belum dikonfigurasi: " + err.message },
      { status: 500 },
    );
  }
}
