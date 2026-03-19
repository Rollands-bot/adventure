"use client";

import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Pilih Gear",
      description: "Browse katalog kami dan pilih peralatan yang kamu butuhkan untuk petualanganmu.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Tentukan Tanggal",
      description: "Pilih tanggal sewa sesuai jadwal petualanganmu. Minimal 1 hari, maksimal bebas.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Bayar & Ambil",
      description: "Lakukan pembayaran dan ambil peralatan di lokasi atau pilih layanan antar.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="cara-kerja" className="section-padding bg-gradient-to-br from-brand-900 via-brand-800 to-brand-900 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-white font-medium text-sm mb-4">
            Cara Kerja
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sewa dalam 3 Langkah Mudah
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Proses sewa yang simpel dan cepat, jadi kamu bisa fokus menikmati petualangan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent" />
              )}

              <div className="relative text-center">
                {/* Number Badge */}
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                  <div className="text-white">{step.icon}</div>
                </div>

                {/* Step Number */}
                <div className="text-5xl font-bold text-white/10 absolute -top-4 left-1/2 transform -translate-x-1/2 -z-10">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
