import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyToken } from "@/lib/admin-tokens";

const htmlResponse = (
  title: string,
  detail: string,
  success: boolean,
  status = 200,
) => {
  const color = success ? "#10b981" : "#ef4444";
  const bgTint = success ? "#ecfdf5" : "#fef2f2";
  const icon = success ? "✅" : "⚠️";

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Ruang Aktif Adventure</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      background: linear-gradient(180deg, ${bgTint} 0%, #f9fafb 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
    }
    .card {
      background: white;
      border-radius: 1.25rem;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.08);
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 4.5rem; margin-bottom: 0.75rem; line-height: 1; }
    h1 {
      color: ${color};
      margin: 0 0 0.75rem;
      font-size: 1.5rem;
      font-weight: 700;
    }
    p {
      color: #4b5563;
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .brand {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid #f3f4f6;
      color: #9ca3af;
      font-size: 0.85rem;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${detail}</p>
    <div class="brand">Ruang Aktif Adventure</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
};

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const token = params.get("token");
  const expectedId = params.get("id");
  const expectedAction = params.get("do");

  if (!token || !expectedId || !expectedAction) {
    return htmlResponse("Link tidak lengkap", "Parameter kurang.", false, 400);
  }

  let parsed;
  try {
    parsed = verifyToken(token);
  } catch (err: any) {
    return htmlResponse(
      "Server belum dikonfigurasi",
      err.message || "ADMIN_ACTION_SECRET belum diset",
      false,
      500,
    );
  }

  if (!parsed) {
    return htmlResponse(
      "Link tidak valid",
      "Link rusak atau sudah kadaluwarsa (>72 jam).",
      false,
      400,
    );
  }

  if (parsed.orderId !== expectedId || parsed.action !== expectedAction) {
    return htmlResponse(
      "Link tidak cocok",
      "Parameter URL tidak sesuai dengan token.",
      false,
      400,
    );
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return htmlResponse(
      "Server belum dikonfigurasi",
      "SUPABASE_SERVICE_ROLE_KEY env var belum diset.",
      false,
      500,
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", expectedId)
    .single();

  if (error || !order) {
    return htmlResponse(
      "Order tidak ditemukan",
      `ID pesanan ${expectedId.slice(0, 8)} tidak ada di database.`,
      false,
      404,
    );
  }

  if (order.status !== "pending") {
    const label: Record<string, string> = {
      confirmed: "sudah dikonfirmasi",
      rejected: "sudah ditolak",
      renting: "sedang disewa",
      returned: "sudah dikembalikan",
      cancelled: "sudah dibatalkan",
    };
    return htmlResponse(
      `Pesanan ${label[order.status] || order.status}`,
      "Aksi ini sudah diproses sebelumnya. Satu link cuma bisa dipakai sekali.",
      false,
      409,
    );
  }

  const newStatus = expectedAction === "confirm" ? "confirmed" : "rejected";
  const paymentStatus = expectedAction === "confirm" ? "paid" : "failed";

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: newStatus, payment_status: paymentStatus })
    .eq("id", expectedId);

  if (updateError) {
    return htmlResponse("Gagal update", updateError.message, false, 500);
  }

  return htmlResponse(
    expectedAction === "confirm"
      ? `Pesanan #${expectedId.slice(0, 8)} dikonfirmasi`
      : `Pesanan #${expectedId.slice(0, 8)} ditolak`,
    expectedAction === "confirm"
      ? "Status pesanan dikonfirmasi & pembayaran divalidasi. User akan lihat update di dashboard."
      : "Status pesanan diset sebagai ditolak. User akan lihat update di dashboard.",
    true,
  );
}
