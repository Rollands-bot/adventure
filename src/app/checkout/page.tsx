"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile, loading: authLoading, supabase } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: profile?.email || user?.email || "",
    phone: profile?.phone || "",
    startDate: items[0]?.start_date || "",
    rentalDays: items[0]?.rental_days || 1,
    notes: "",
  });

  const [error, setError] = useState("");

  // Redirect based on auth/cart state (side effects belong in useEffect, not render)
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent("/checkout")}`);
      return;
    }
    if (items.length === 0) {
      router.replace("/produk");
    }
  }, [authLoading, user, items.length, router]);

  // Sync form defaults once profile loads
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || profile.full_name || "",
        email: prev.email || profile.email || "",
        phone: prev.phone || profile.phone || "",
      }));
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("File harus berupa gambar (JPG, PNG, dll)");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file maksimal 2MB");
        return;
      }
      setError("");
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || processing) return;
    setError("");
    setProcessing(true);

    try {
      // Calculate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + formData.rentalDays);

      // Create order items
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price_per_day: item.product.price_per_day,
        subtotal: item.product.price_per_day * item.quantity * item.rental_days,
      }));

      // Create order with payment proof
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([{
          user_id: user.id,
          total_amount: totalPrice,
          status: "pending",
          payment_status: "pending",
          rental_days: formData.rentalDays,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          notes: formData.notes,
          payment_proof_url: null, // Will update after upload
        }])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(
          orderItems.map((item) => ({
            order_id: order.id,
            ...item,
          }))
        );

      if (itemsError) throw itemsError;

      // Upload payment proof if exists
      let paymentProofUrl = null;
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `${order.id}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, selectedFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // Continue even if upload fails - admin can request proof via WA
        } else {
          paymentProofUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/payment-proofs/${fileName}`;
          
          // Update order with proof URL
          await supabase
            .from("orders")
            .update({ payment_proof_url: paymentProofUrl })
            .eq("id", order.id);
        }
      }

      // Clear cart
      clearCart();

      // Fetch signed admin action URLs (1-click confirm/reject from WhatsApp)
      let adminQuickActions = "";
      try {
        const linksRes = await fetch("/api/orders/action-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: order.id }),
        });
        if (linksRes.ok) {
          const { confirmUrl, rejectUrl } = await linksRes.json();
          adminQuickActions = `

━━━━━━━━━━━━━━━━━━━━
🔐 *ADMIN QUICK ACTION*
✅ Konfirmasi: ${confirmUrl}
❌ Tolak: ${rejectUrl}
━━━━━━━━━━━━━━━━━━━━`;
        }
      } catch (linkErr) {
        console.error("Gagal generate admin links:", linkErr);
      }

      // Redirect to WhatsApp for validation
      const adminPhone = "6285129966730";
      const productLines = items
        .map((item, i) => {
          const subtotal =
            item.product.price_per_day * item.quantity * item.rental_days;
          return `${i + 1}. ${item.product.name} (${item.product.category})
   ${item.quantity} unit × ${item.rental_days} hari × Rp${item.product.price_per_day.toLocaleString("id-ID")} = Rp${subtotal.toLocaleString("id-ID")}`;
        })
        .join("\n");

      const message = `Halo Admin Ruang Aktif Adventure! 🏕️

Saya sudah melakukan pemesanan dengan detail:

📦 *ID Pesanan:* ${order.id.slice(0, 8)}...
👤 *Nama:* ${formData.fullName}
📱 *WhatsApp:* ${formData.phone}
📅 *Tanggal Sewa:* ${startDate.toLocaleDateString("id-ID")} - ${endDate.toLocaleDateString("id-ID")} (${formData.rentalDays} hari)

🛒 *Daftar Produk:*
${productLines}

💰 *Total Pembayaran:* Rp${totalPrice.toLocaleString("id-ID")}

${selectedFile ? "✅ Saya sudah upload bukti transfer" : "⏳ Saya akan transfer segera"}${formData.notes ? `\n\n📝 *Catatan:* ${formData.notes}` : ""}

Mohon konfirmasi ketersediaan dan validasi pembayaran. Terima kasih!${adminQuickActions}`;

      const waUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp
      window.open(waUrl, "_blank");

      // Redirect to success page with order details
      router.push(
        `/checkout/success?orderId=${encodeURIComponent(order.id)}&total=${totalPrice}`,
      );
      
    } catch (err: any) {
      console.error("Checkout error:", err);
      setError(err.message || "Terjadi kesalahan saat memproses pesanan");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || !user || items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-28 md:pt-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="section-padding pt-28 md:pt-32">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 py-3 border-b last:border-0">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.quantity} unit × {item.rental_days} hari × Rp{item.product.price_per_day.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900">
                      Rp{(item.product.price_per_day * item.quantity * item.rental_days).toLocaleString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4 flex justify-between items-center">
                <span className="text-lg font-medium text-gray-600">Total Pembayaran</span>
                <span className="text-2xl font-bold text-brand-600">
                  Rp{totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Pemesan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="08xx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Rental Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Penyewaan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai Sewa
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi Sewa (hari)
                  </label>
                  <input
                    type="number"
                    value={formData.rentalDays}
                    onChange={(e) => setFormData({ ...formData, rentalDays: parseInt(e.target.value) || 1 })}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan (opsional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Pesan atau permintaan khusus..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-4">Instruksi Pembayaran</h2>
              <div className="space-y-3 text-sm text-blue-800">
                <p>📍 <strong>Transfer ke rekening:</strong></p>
                <div className="bg-white rounded-lg p-4 ml-6">
                  <p className="font-medium">Bank BCA</p>
                  <p className="text-lg font-bold">8951234567</p>
                  <p className="text-gray-600">a.n Ruang Aktif Adventure</p>
                </div>
                <p className="ml-6">Atau scan QRIS yang akan ditampilkan setelah checkout</p>
                <p>📸 <strong>Upload bukti transfer</strong> di bawah ini untuk mempercepat validasi</p>
              </div>
            </div>

            {/* Payment Proof Upload */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bukti Transfer</h2>
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                {previewImage && (
                  <div className="relative w-full max-w-xs sm:max-w-md">
                    <Image
                      src={previewImage}
                      alt="Preview bukti transfer"
                      width={400}
                      height={300}
                      className="rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setSelectedFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                {error && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
                <p className="text-sm text-gray-500">
                  Format: JPG, PNG | Maksimal 2MB
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full btn-primary text-lg py-4"
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </span>
              ) : (
                "Buat Pesanan & Validasi via WhatsApp"
              )}
            </button>

            <p className="text-sm text-gray-500 text-center">
              Setelah klik tombol di atas, Anda akan diarahkan ke WhatsApp Admin untuk validasi pembayaran
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </main>
  );
}
