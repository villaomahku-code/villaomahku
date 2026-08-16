import React from "react";

// TODO: Kita akan membuka comment (uncomment) baris-baris ini 
// satu per satu di step berikutnya saat file-nya sudah dibuat.

// import Navbar from "@/components/sections/Navbar";
// import Hero from "@/components/sections/Hero";
// import About from "@/components/sections/About";
// import Highlights from "@/components/sections/Highlights";
// import Rooms from "@/components/sections/Rooms";
// import Facilities from "@/components/sections/Facilities";
// import Gallery from "@/components/sections/Gallery";
// import Experience from "@/components/sections/Experience";
// import Location from "@/components/sections/Location";
// import Testimonials from "@/components/sections/Testimonials";
// import CTA from "@/components/sections/CTA";
// import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      {/* <Navbar /> */}

      <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-cream">
        {/* <Hero /> */}
        {/* <About /> */}
        {/* <Highlights /> */}
        {/* <Rooms /> */}
        {/* <Facilities /> */}
        {/* <Gallery /> */}
        {/* <Experience /> */}
        {/* <Location /> */}
        {/* <Testimonials /> */}
        {/* <CTA /> */}

        {/* --- TAMPILAN SEMENTARA --- */}
        {/* Hapus bagian ini nanti saat Hero section sudah dibuat */}
        <section className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
          <h1 className="font-serif text-4xl font-bold text-villa-900 md:text-6xl mb-4">
            Villa Omahku Sumberejo
          </h1>
          <p className="font-sans text-lg text-villa-700 max-w-xl">
            Struktur utama app/page.tsx sudah siap. Menunggu komponen-komponen lain dirakit.
          </p>
        </section>
        {/* ------------------------- */}
      </main>

      {/* <Footer /> */}
    </>
  );
}