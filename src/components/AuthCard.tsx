"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

const AuthCard = ({
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>

        {children}

        {/* Footer */}
        <p className="text-center mt-8 text-gray-600 text-sm">
          {footerText}{" "}
          <Link
            href={footerLink}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            {footerLinkText}
          </Link>
        </p>

        {/* Privacy & Terms Links */}
        <div className="flex justify-center gap-4 mt-6 text-xs text-gray-500">
          <Link
            href="/privacy"
            className="hover:text-gray-700 transition-colors"
          >
            Privacy Policy
          </Link>
          <span>•</span>
          <Link
            href="/terms"
            className="hover:text-gray-700 transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthCard;
