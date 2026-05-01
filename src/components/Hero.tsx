"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Outdoor adventure background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto pt-28 md:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white/90 text-sm font-medium mb-6">
            🏔️ Partner Petualangan Terbaik Anda
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Sewa Perlengkapan{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-brand-300">
            Outdoor
          </span>{" "}
          Tanpa Ribet
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
        >
          Semua kebutuhan camping & hiking dalam satu tempat. Kualitas terbaik,
          harga terjangkau, proses mudah.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/produk" className="btn-primary text-lg px-8 py-4">
            Mulai Sewa
            <svg
              className="inline-block w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link href="/produk" className="btn-secondary text-lg px-8 py-4">
            Lihat Peralatan
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">
              500+
            </div>
            <div className="text-white/70 text-sm mt-1">Peralatan</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">
              2000+
            </div>
            <div className="text-white/70 text-sm mt-1">Customer</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white">
              4.9
            </div>
            <div className="text-white/70 text-sm mt-1">Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
