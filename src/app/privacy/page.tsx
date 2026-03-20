import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="section-padding bg-gray-50 pt-24">
        <div className="w-full">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mb-8">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Pendahuluan</h2>
              <p className="text-gray-700 mb-4">
                Ruang Aktif Adventure ("kami", "kita", atau "milik kami") menghormati privasi Anda dan berkomitmen untuk melindungi informasi pribadi yang Anda bagikan kepada kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi Anda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Informasi yang Kami Kumpulkan</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Informasi yang Anda Berikan:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Nama lengkap</li>
                <li>Alamat email</li>
                <li>Nomor telepon/WhatsApp</li>
                <li>Informasi akun (username, password)</li>
                <li>Informasi pembayaran</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Informasi yang Dikumpulkan Secara Otomatis:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Data penggunaan website</li>
                <li>Informasi perangkat dan browser</li>
                <li>Alamat IP</li>
                <li>Cookie dan teknologi pelacakan serupa</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Bagaimana Kami Menggunakan Informasi Anda</h2>
              <p className="text-gray-700 mb-4">Kami menggunakan informasi yang dikumpulkan untuk:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Memproses transaksi dan pesanan rental</li>
                <li>Mengirimkan konfirmasi dan update pesanan</li>
                <li>Memberikan dukungan pelanggan</li>
                <li>Mengirimkan informasi promosi (dengan persetujuan Anda)</li>
                <li>Meningkatkan layanan dan website kami</li>
                <li>Mendeteksi dan mencegah penipuan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Berbagi Informasi</h2>
              <p className="text-gray-700 mb-4">
                Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa persetujuan Anda, kecuali:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Diperlukan untuk memproses pesanan Anda</li>
                <li>Diwajibkan oleh hukum</li>
                <li>Untuk melindungi hak dan keamanan kami</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Keamanan Data</h2>
              <p className="text-gray-700 mb-4">
                Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses tidak sah, perubahan, pengungkapan, atau penghancuran.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Hak Anda</h2>
              <p className="text-gray-700 mb-4">Anda memiliki hak untuk:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Mengakses informasi pribadi Anda</li>
                <li>Memperbarui atau mengoreksi informasi Anda</li>
                <li>Menghapus akun Anda</li>
                <li>Menarik persetujuan untuk pemrosesan data</li>
                <li>Menonaktifkan komunikasi pemasaran</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookie</h2>
              <p className="text-gray-700 mb-4">
                Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna. Anda dapat mengatur browser Anda untuk menolak cookie, namun hal ini mungkin membatasi fungsionalitas website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Perubahan Kebijakan</h2>
              <p className="text-gray-700 mb-4">
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal pembaruan yang baru.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Hubungi Kami</h2>
              <p className="text-gray-700 mb-4">
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami di:
              </p>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <p className="text-gray-700"><strong>Email:</strong> hello@ruangaktif.com</p>
                <p className="text-gray-700"><strong>Telepon:</strong> +62 851-2996-6730</p>
                <p className="text-gray-700"><strong>Alamat:</strong> Jl. Raya Serang No.Km.10 15810 Curug Banten</p>
              </div>
            </section>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
