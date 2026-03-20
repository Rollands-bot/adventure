"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  delay?: number;
  product?: Product;
}

const ProductCard = ({ image, name, price, category, rating, delay = 0, product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [rentalDays, setRentalDays] = useState(1);
  const [startDate, setStartDate] = useState("");

  const handleAddToCart = () => {
    if (!product) return;
    
    const today = new Date().toISOString().split("T")[0];
    addToCart(
      product,
      quantity,
      rentalDays,
      startDate || today
    );
    setShowModal(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -8 }}
        className="card group"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              {category}
            </span>
          </div>
          {/* Quick action button */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-sm px-6 py-2"
            >
              Sewa Sekarang
            </button>
            <Link
              href="/cart"
              className="px-6 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 hover:bg-white transition-colors"
            >
              Lihat Keranjang
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-sm text-gray-500 ml-2">({rating})</span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-brand-600">Rp{price.toLocaleString("id-ID")}</span>
              <span className="text-gray-500 text-sm">/hari</span>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-10 h-10 bg-brand-600/10 rounded-full flex items-center justify-center group-hover:bg-brand-600 transition-colors"
            >
              <svg
                className="w-5 h-5 text-brand-600 group-hover:text-white transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Add to Cart Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowModal(false)}
            />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Sewa Produk</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-900">{name}</h4>
                <p className="text-brand-600 font-bold">Rp{price.toLocaleString("id-ID")}/hari</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mulai Sewa
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durasi Sewa (hari)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rentalDays}
                    onChange={(e) => setRentalDays(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Harga per hari</span>
                    <span>Rp{price.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Jumlah</span>
                    <span>× {quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Durasi</span>
                    <span>× {rentalDays} hari</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-600">Rp{(price * quantity * rentalDays).toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
                >
                  Tambah ke Keranjang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
