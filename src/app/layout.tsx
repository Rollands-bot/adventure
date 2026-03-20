import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ruang Aktif Adventure - Sewa Perlengkapan Outdoor Tanpa Ribet",
  description:
    "Sewa perlengkapan outdoor dan camping berkualitas tinggi dengan harga terjangkau. Tenda, carrier, sleeping bag, dan peralatan hiking lengkap tersedia.",
  keywords: [
    "sewa tenda",
    "sewa peralatan camping",
    "sewa carrier",
    "sewa sleeping bag",
    "outdoor adventure",
    "hiking gear",
    "camping gear",
  ],
  authors: [{ name: "Ruang Aktif Adventure" }],
  openGraph: {
    title: "Ruang Aktif Adventure - Sewa Perlengkapan Outdoor Tanpa Ribet",
    description:
      "Semua kebutuhan camping & hiking dalam satu tempat. Kualitas terbaik, harga terjangkau, proses mudah.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
