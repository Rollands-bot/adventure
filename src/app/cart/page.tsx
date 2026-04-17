"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, updateRentalDays, updateStartDate, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      // Save current URL to redirect back after login
      localStorage.setItem("redirectAfterLogin", "/checkout");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Keranjang Masih Kosong</h2>
            <p className="text-gray-600 mb-6">Mulai pilih peralatan outdoor untuk petualanganmu!</p>
            <button
              onClick={() => router.push("/produk")}
              className="btn-primary"
            >
              Lihat Produk
            </button>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="section-padding pt-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Keranjang Sewa</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex gap-4"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                    <p className="text-brand-600 font-bold">
                      Rp{item.product.price_per_day.toLocaleString("id-ID")}/hari
                    </p>

                    <div className="flex gap-4 mt-3">
                      <div>
                        <label className="text-xs text-gray-500">Jumlah</label>
                        <input
                          type="number"
                          min="1"
                          max={item.product.stock}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                          }
                          className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Durasi (hari)</label>
                        <input
                          type="number"
                          min="1"
                          value={item.rental_days}
                          onChange={(e) =>
                            updateRentalDays(item.product.id, parseInt(e.target.value) || 1)
                          }
                          className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Tanggal Mulai</label>
                        <input
                          type="date"
                          value={item.start_date}
                          onChange={(e) =>
                            updateStartDate(item.product.id, e.target.value)
                          }
                          className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Rp{(item.product.price_per_day * item.quantity * item.rental_days).toLocaleString("id-ID")}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 text-sm mt-2"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Total Item</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)} unit</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>Rp{totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-600">Rp{totalPrice.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full btn-primary mb-3"
                >
                  {processing ? "Memproses..." : "Lanjut ke Checkout"}
                </button>

                <button
                  onClick={() => {
                    if (confirm("Hapus semua item dari keranjang?")) {
                      clearCart();
                    }
                  }}
                  className="w-full py-3 text-gray-600 hover:text-red-600 transition-colors text-sm"
                >
                  Kosongkan Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
