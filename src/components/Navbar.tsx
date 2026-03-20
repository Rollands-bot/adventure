"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { user, loading, signOut, isAdmin, isStaff } = useAuth();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/produk", label: "Produk" },
    { href: "/cara-kerja", label: "Cara Kerja" },
    { href: "/kontak", label: "Kontak" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Ruang Aktif Adventure"
              width={70}
              height={70}
              className="rounded-lg"
            />
            <span
              className="font-bold text-xl hidden sm:block text-gray-900"
            >
              Ruang Aktif Adventure
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-gray-700 transition-colors hover:text-brand-600"
              >
                {link.label}
              </Link>
            ))}
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-brand-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-xs rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!loading && user ? (
              <>
                <Link
                  href={isAdmin || isStaff ? "/admin" : "/dashboard"}
                  className="font-medium text-gray-700 transition-colors hover:text-brand-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                      // Clear all cookies and redirect
                      document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                          .replace(/^ +/, "")
                          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                      });
                      window.location.replace("/");
                    } catch (error) {
                      console.error("Logout error:", error);
                      window.location.href = "/";
                    }
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="font-medium text-gray-700 transition-colors hover:text-brand-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm px-5 py-2.5"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-900"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t"
          >
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-brand-600 font-medium"
              >
                {link.label}
              </Link>
            ))}
            {/* Cart Link */}
            <Link
              href="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-700 hover:text-brand-600 font-medium"
            >
              Keranjang
              {totalItems > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-brand-600 text-white text-xs rounded-full">
                  {totalItems} item
                </span>
              )}
            </Link>
            {!loading && user ? (
              <>
                <Link
                  href={isAdmin || isStaff ? "/admin" : "/dashboard"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-brand-600 font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={async () => {
                    try {
                      await signOut();
                      setIsMobileMenuOpen(false);
                      // Clear all cookies and redirect
                      document.cookie.split(";").forEach((c) => {
                        document.cookie = c
                          .replace(/^ +/, "")
                          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                      });
                      window.location.replace("/");
                    } catch (error) {
                      console.error("Logout error:", error);
                      setIsMobileMenuOpen(false);
                      window.location.href = "/";
                    }
                  }}
                  className="w-full text-left text-red-600 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center btn-outline text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center btn-primary text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
