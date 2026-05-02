"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart, showFlash } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const id = params?.id;
    if (!id) return;

    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (cancelled) return;

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProduct(data as Product);
      setLoading(false);

      // Related products (same category, different id)
      const { data: rel } = await supabase
        .from("products")
        .select("*")
        .eq("category", (data as Product).category)
        .neq("id", id)
        .eq("is_available", true)
        .limit(4);
      if (!cancelled && rel) setRelated(rel as Product[]);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const stock = product?.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const overStock = quantity > stock;
  const total = product
    ? product.price_per_day * quantity * rentalDays
    : 0;

  const handleAddToCart = () => {
    if (!product || overStock || isOutOfStock) return;
    const today = new Date().toISOString().split("T")[0];
    addToCart(product, quantity, rentalDays, startDate || today);
    showFlash(`${product.name} ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    if (!product || overStock || isOutOfStock) return;
    const today = new Date().toISOString().split("T")[0];
    addToCart(product, quantity, rentalDays, startDate || today);
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-28">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-600" />
        </div>
        <Footer />
      </main>
    );
  }

  if (notFound || !product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh] pt-28 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Produk tidak ditemukan
            </h2>
            <p className="text-gray-600 mb-6">
              Produk yang lo cari mungkin udah dihapus atau gak tersedia.
            </p>
            <Link href="/produk" className="btn-primary px-6 py-3">
              Lihat Semua Produk
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="section-padding pt-28 md:pt-32">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-brand-600">
              Home
            </Link>
            <span>/</span>
            <Link href="/produk" className="hover:text-brand-600">
              Produk
            </Link>
            <span>/</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white rounded-full text-sm font-semibold">
                    Stok Habis
                  </div>
                )}
              </div>
            </motion.div>

            {/* Detail */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col"
            >
              <span className="inline-block w-fit px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-xs font-medium mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < (product.rating ?? 5) ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-sm text-gray-500">
                  ({product.rating ?? 5})
                </span>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-brand-600">
                  Rp{product.price_per_day.toLocaleString("id-ID")}
                </span>
                <span className="text-gray-500 ml-1">/hari</span>
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="mb-6 flex items-center gap-2 text-sm">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-medium ${
                    isOutOfStock
                      ? "bg-red-100 text-red-700"
                      : stock <= 3
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {isOutOfStock
                    ? "Stok habis"
                    : stock <= 3
                    ? `Stok terbatas (${stock} unit)`
                    : `Tersedia (${stock} unit)`}
                </span>
              </div>

              {/* Booking form */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Pilih Detail Sewa</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Jumlah
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={stock}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      disabled={isOutOfStock}
                      className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed ${
                        overStock ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Durasi (hari)
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={rentalDays}
                      onChange={(e) =>
                        setRentalDays(Math.max(1, parseInt(e.target.value) || 1))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tanggal Mulai Sewa
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                {overStock && (
                  <p className="text-xs text-red-600">
                    Maksimal {stock} unit yang bisa lo sewa.
                  </p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="text-xl font-bold text-brand-600">
                    Rp{total.toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || overStock}
                    className="flex-1 px-4 py-3 border border-brand-600 text-brand-600 rounded-lg font-medium hover:bg-brand-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Tambah ke Keranjang
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={isOutOfStock || overStock}
                    className="flex-1 px-4 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sewa Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Produk Terkait
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    image={p.image_url}
                    name={p.name}
                    price={p.price_per_day}
                    category={p.category}
                    rating={p.rating ?? 5}
                    delay={i * 0.05}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
