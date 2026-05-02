import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const CaraKerja = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="pt-28 md:pt-32">
        <HowItWorks />
      </section>
      <Footer />
    </main>
  );
};

export default CaraKerja;
