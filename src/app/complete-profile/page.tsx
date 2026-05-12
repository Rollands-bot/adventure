"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import AuthCard from "@/components/AuthCard";
import Navbar from "@/components/Navbar";

const isSafeNext = (value: string | null): value is string =>
  !!value && /^\/[^/]/.test(value);

export default function CompleteProfilePage() {
  const router = useRouter();
  const { user, profile, loading, supabase, signOut } = useAuth();
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [nextPath, setNextPath] = useState<string | null>(null);

  // Read ?next= once on mount.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get("next");
    setNextPath(isSafeNext(raw) ? raw : null);
  }, []);

  // Send unauthenticated visitors to /login (this page is only meant
  // for users who just finished OAuth and still need a phone).
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // If the profile is already complete, leave — they don't belong here.
  useEffect(() => {
    if (!loading && user && profile?.phone) {
      router.replace(nextPath ?? "/produk");
    }
  }, [loading, user, profile, nextPath, router]);

  const displayName =
    profile?.full_name ||
    (user?.user_metadata?.full_name as string | undefined) ||
    (user?.user_metadata?.name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Sesi tidak ditemukan. Silakan login ulang.");
      return;
    }
    if (!agreeTerms) {
      setError("Anda harus menyetujui syarat & ketentuan.");
      return;
    }
    const trimmed = phone.trim();
    if (!trimmed) {
      setError("Nomor WhatsApp wajib diisi.");
      return;
    }

    setIsSaving(true);
    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ phone: trimmed, updated_at: new Date().toISOString() })
        .eq("id", user.id);
      if (updateError) throw updateError;
      router.replace(nextPath ?? "/produk");
    } catch (err: any) {
      setError(err?.message || "Gagal menyimpan profil. Coba lagi.");
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-28 md:pt-32 pb-12">
        <AuthCard
          title={displayName ? `Halo, ${displayName.split(" ")[0]}!` : "Hampir Selesai"}
          subtitle="Tinggal satu langkah lagi untuk memulai petualangan Anda"
          footerText="Bukan akun Anda?"
          footerLink="/login"
          footerLinkText="Keluar dan ganti akun"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
              Akun Google{" "}
              <span className="font-medium">{user?.email}</span> berhasil
              terhubung. Lengkapi nomor WhatsApp untuk menyelesaikan
              pendaftaran.
            </div>

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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-3456-7890"
                required
                autoFocus
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Kami pakai nomor ini untuk koordinasi pengiriman & pickup.
              </p>
            </div>

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

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {isSaving ? "Menyimpan..." : "Selesaikan Pendaftaran"}
            </button>

            <button
              type="button"
              onClick={async () => {
                await signOut();
                router.replace("/login");
              }}
              className="w-full text-sm font-medium text-gray-500 hover:text-gray-700 py-2 transition-colors"
            >
              Batal & keluar
            </button>
          </form>
        </AuthCard>
      </div>
    </div>
  );
}
