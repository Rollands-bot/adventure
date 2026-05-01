"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AuthCard from "@/components/AuthCard";
import Navbar from "@/components/Navbar";

const EMAIL_PROVIDERS: Record<string, { name: string; url: string }> = {
  "gmail.com": { name: "Gmail", url: "https://mail.google.com" },
  "googlemail.com": { name: "Gmail", url: "https://mail.google.com" },
  "yahoo.com": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
  "yahoo.co.id": { name: "Yahoo Mail", url: "https://mail.yahoo.com" },
  "outlook.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
  "hotmail.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
  "live.com": { name: "Outlook", url: "https://outlook.live.com/mail" },
  "icloud.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
  "me.com": { name: "iCloud Mail", url: "https://www.icloud.com/mail" },
  "proton.me": { name: "Proton Mail", url: "https://mail.proton.me" },
  "protonmail.com": { name: "Proton Mail", url: "https://mail.proton.me" },
};

const getEmailProvider = (email: string) => {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return null;
  return EMAIL_PROVIDERS[domain] ?? null;
};

const RESEND_COOLDOWN_SEC = 60;

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const { signInWithMagicLink, signInWithGoogle, supabase } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat & ketentuan");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signInWithMagicLink(formData.email, {
        data: {
          full_name: formData.fullName,
          phone: formData.phone,
        },
      });

      if (error) throw error;

      setRegisteredEmail(formData.email);
      setSuccess(true);
      setFormData({ fullName: "", email: "", phone: "" });
      setAgreeTerms(false);
      setResendCooldown(RESEND_COOLDOWN_SEC);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (isGoogleLoading) return;
    setError("");
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Gagal mendaftar dengan Google.");
      setIsGoogleLoading(false);
    }
  };

  // Poll session every 3s after registration. When the user clicks the
  // confirmation link (which sets a cookie), getSession() picks it up and
  // we auto-redirect — no need to manually return to this tab.
  useEffect(() => {
    if (!success) return;
    const interval = setInterval(async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        clearInterval(interval);
        router.push("/dashboard");
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [success, supabase, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending || !registeredEmail) return;
    setIsResending(true);
    setResendMessage("");
    try {
      const { error } = await signInWithMagicLink(registeredEmail);
      if (error) throw error;
      setResendMessage("Link sudah dikirim ulang.");
      setResendCooldown(RESEND_COOLDOWN_SEC);
    } catch (err: any) {
      setResendMessage(err.message || "Gagal mengirim ulang email.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-24 pb-12">
      <AuthCard
        title="Buat Akun Baru"
        subtitle="Mulai petualangan Anda bersama kami"
        footerText="Sudah punya akun?"
        footerLink="/login"
        footerLinkText="Masuk sekarang"
      >
        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h3>
            <p className="text-gray-600 mb-1">
              Kami sudah mengirim link verifikasi ke
            </p>
            <p className="font-medium text-gray-900 mb-6 break-all">
              {registeredEmail}
            </p>

            {(() => {
              const provider = getEmailProvider(registeredEmail);
              if (!provider) return null;
              return (
                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/30 mb-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Buka {provider.name}
                </a>
              );
            })()}

            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isResending}
              className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed py-2 transition-colors"
            >
              {isResending
                ? "Mengirim..."
                : resendCooldown > 0
                ? `Kirim ulang dalam ${resendCooldown}s`
                : "Tidak menerima email? Kirim ulang"}
            </button>

            {resendMessage && (
              <p className="text-sm text-gray-600 mt-2">{resendMessage}</p>
            )}

            <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Menunggu verifikasi… halaman akan otomatis lanjut.</span>
            </div>
          </div>
        ) : (
        <>
          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isGoogleLoading || isLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            {isGoogleLoading ? "Mengarahkan ke Google..." : "Daftar dengan Google"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">atau pakai email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name Input */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nama Lengkap
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nomor WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="0812-3456-7890"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Terms & Conditions */}
          <div>
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600">
                Saya menyetujui{" "}
                <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Syarat & Ketentuan
                </Link>{" "}
                dan{" "}
                <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Kebijakan Privasi
                </Link>
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isGoogleLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Mengirim link...
              </span>
            ) : (
              "Daftar"
            )}
          </button>
        </form>
        </>
        )}
      </AuthCard>
      </div>
    </div>
  );
}
