"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";

const HOME_LIMIT = 8;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .limit(HOME_LIMIT);

      if (cancelled) return;
      if (!error && data) setProducts(data as Product[]);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="produk" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-brand-600/10 rounded-full text-brand-600 font-medium text-sm mb-4">
            Katalog Produk
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Peralatan Outdoor Lengkap
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pilih dari ratusan peralatan outdoor berkualitas tinggi untuk petualanganmu
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Belum ada produk tersedia.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                image={product.image_url}
                name={product.name}
                price={product.price_per_day}
                category={product.category}
                rating={product.rating ?? 5}
                delay={index * 0.1}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/produk"
            className="btn-outline inline-flex items-center"
          >
            Lihat Semua Produk
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
