"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50">
          <Navbar />
          <div className="flex items-center justify-center min-h-[60vh] pt-28">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
          </div>
          <Footer />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") ?? "";
  const total = searchParams.get("total") ?? "";
  const [copied, setCopied] = useState(false);

  const shortId = orderId ? `${orderId.slice(0, 8)}` : "";

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const handleCopyId = async () => {
    if (!orderId) return;
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="section-padding pt-28 md:pt-32">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 220 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Pesanan Berhasil Dibuat! 🎉
            </h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tim Ruang Aktif Adventure akan menghubungi lo via WhatsApp buat konfirmasi & validasi pembayaran.
            </p>

            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  ID Pesanan
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base sm:text-lg font-semibold text-gray-900">
                    {shortId}…
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="text-xs px-2 py-1 rounded-md bg-white border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                {total && (
                  <p className="text-xs text-gray-500 mt-2">
                    Total:{" "}
                    <span className="font-semibold text-gray-700">
                      Rp{Number(total).toLocaleString("id-ID")}
                    </span>
                  </p>
                )}
              </div>
            )}

            <div className="text-left bg-blue-50 border border-blue-100 rounded-xl p-4 sm:p-5 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3 text-sm sm:text-base">
                Langkah selanjutnya
              </h3>
              <ol className="space-y-2 text-sm text-blue-900/90">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <span>Tab WhatsApp sudah otomatis kebuka — kirim pesan ke admin biar pesanan diproses cepat.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                  <span>Admin verifikasi bukti transfer & ketersediaan barang.</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                  <span>Status pesanan bisa lo cek kapan aja di Dashboard.</span>
                </li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/dashboard"
                className="btn-primary px-6 py-3"
              >
                Lihat Pesanan Saya
              </Link>
              <Link
                href="/produk"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
              >
                Sewa Lagi
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
