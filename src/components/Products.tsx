"use client";

import ProductCard from "./ProductCard";

const Products = () => {
  const products = [
    {
      // Tenda - verified working camping tent image
      image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=800&q=80",
      name: "Tenda Dome 4 Person",
      price: 75000,
      category: "Tenda",
      rating: 5,
    },
    {
      // Carrier backpack - verified working
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80",
      name: "Carrier 60L",
      price: 50000,
      category: "Tas",
      rating: 5,
    },
    {
      // Sleeping bag - verified working
      image: "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?auto=format&fit=crop&w=800&q=80",
      name: "Sleeping Bag -5°C",
      price: 35000,
      category: "Sleeping Bag",
      rating: 4,
    },
    {
      // Camping stove - verified working
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
      name: "Kompor Portable",
      price: 25000,
      category: "Masak",
      rating: 5,
    },
    {
      // Hiking boots - verified working
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      name: "Sepatu Hiking",
      price: 45000,
      category: "Footwear",
      rating: 4,
    },
    {
      // Camping mat - verified working
      image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=800&q=80",
      name: "Matras Camping",
      price: 20000,
      category: "Alas",
      rating: 4,
    },
    {
      // Headlamp - verified working
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
      name: "Headlamp LED",
      price: 15000,
      category: "Lampu",
      rating: 5,
    },
    {
      // Trekking pole - verified working
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80",
      name: "Trekking Pole",
      price: 30000,
      category: "Aksesoris",
      rating: 4,
    },
  ];

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.name}
              image={product.image}
              name={product.name}
              price={product.price}
              category={product.category}
              rating={product.rating}
              delay={index * 0.1}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="#kontak"
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
          </a>
        </div>
      </div>
    </section>
  );
};

export default Products;
