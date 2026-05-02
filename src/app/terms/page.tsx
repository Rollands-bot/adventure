import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="section-padding bg-gray-50 pt-28 md:pt-32">
        <div className="w-full">
          <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Terms of Service
            </h1>
            <p className="text-gray-600 mb-8">
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
            </p>

            <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Penerimaan Syarat</h2>
              <p className="text-gray-700 mb-4">
                Dengan mengakses dan menggunakan layanan Ruang Aktif Adventure, Anda menerima dan terikat dengan Syarat & Ketentuan ini. Jika Anda tidak setuju dengan syarat ini, harap tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Layanan Kami</h2>
              <p className="text-gray-700 mb-4">
                Ruang Aktif Adventure menyediakan layanan sewa peralatan outdoor dan camping. Kami berusaha menyediakan peralatan dalam kondisi baik, namun kami tidak menjamin ketersediaan semua peralatan setiap saat.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Pendaftaran Akun</h2>
              <p className="text-gray-700 mb-4">Untuk menggunakan layanan kami, Anda harus:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Berusia minimal 17 tahun</li>
                <li>Memberikan informasi yang akurat dan lengkap</li>
                <li>Menjaga kerahasiaan akun Anda</li>
                <li>Bertanggung jawab atas semua aktivitas di akun Anda</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Pemesanan dan Pembayaran</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pemesanan:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Pemesanan dilakukan melalui website atau WhatsApp</li>
                <li>Konfirmasi pesanan akan dikirim via email/WhatsApp</li>
                <li>Kami berhak menolak pesanan yang tidak lengkap</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pembayaran:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Pembayaran dapat dilakukan via transfer bank atau e-wallet</li>
                <li>DP minimal 50% dari total harga sewa</li>
                <li>Pelunasan dilakukan sebelum pengambilan peralatan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Kebijakan Pengambilan dan Pengembalian</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengambilan:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Peralatan diambil di lokasi sesuai jadwal yang disepakati</li>
                <li>Wajib menunjukkan KTP asli dan konfirmasi pesanan</li>
                <li>Periksa kondisi peralatan sebelum mengambil</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pengembalian:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Peralatan harus dikembalikan sesuai jadwal</li>
                <li>Keterlambatan dikenakan denda Rp 50.000/hari</li>
                <li>Peralatan harus dikembalikan dalam kondisi bersih dan utuh</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Kerusakan dan Kehilangan</h2>
              <p className="text-gray-700 mb-4">Penyewa bertanggung jawab atas:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Kerusakan akibat kelalaian (dibebankan biaya perbaikan)</li>
                <li>Kehilangan peralatan (dibebankan harga pengganti)</li>
                <li>Peralatan yang hilang atau rusak harus diganti dengan yang setara</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Pembatalan dan Refund</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pembatalan oleh Penyewa:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>H-7 atau lebih: Refund 100%</li>
                <li>H-3 sampai H-6: Refund 50%</li>
                <li>H-1 atau kurang: Tidak ada refund</li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Pembatalan oleh Kami:</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Refund 100% jika kami membatalkan pesanan</li>
                <li>Alternatif peralatan dengan spesifikasi setara (jika tersedia)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Larangan</h2>
              <p className="text-gray-700 mb-4">Penyewa dilarang:</p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Menggunakan peralatan untuk kegiatan ilegal</li>
                <li>Meminjamkan peralatan kepada pihak lain</li>
                <li>Memodifikasi atau mengubah peralatan</li>
                <li>Menggunakan peralatan di luar kapasitas yang ditentukan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Batasan Tanggung Jawab</h2>
              <p className="text-gray-700 mb-4">
                Ruang Aktif Adventure tidak bertanggung jawab atas:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Kecelakaan atau cedera selama penggunaan peralatan</li>
                <li>Kehilangan barang pribadi penyewa</li>
                <li>Gangguan force majeure (bencana alam, dll)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Perubahan Syarat</h2>
              <p className="text-gray-700 mb-4">
                Kami berhak mengubah Syarat & Ketentuan ini kapan saja. Perubahan akan efektif setelah dipublikasikan di website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Hukum yang Berlaku</h2>
              <p className="text-gray-700 mb-4">
                Syarat & Ketentuan ini diatur oleh hukum Indonesia. Segala sengketa akan diselesaikan melalui musyawarah atau jalur hukum yang berlaku.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Kontak</h2>
              <p className="text-gray-700 mb-4">
                Untuk pertanyaan mengenai Syarat & Ketentuan, hubungi kami di:
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
