import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";

// TODO: Kita akan membuka comment (uncomment) baris-baris ini 
// satu per satu di step berikutnya saat file-nya sudah dibuat.

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
      <Navbar />

      <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-cream">
        <Hero /> 
        
        {/* <About /> */}
        {/* <Highlights /> */}
        {/* <Rooms /> */}
        {/* <Facilities /> */}
        {/* <Gallery /> */}
        {/* <Experience /> */}
        {/* <Location /> */}
        {/* <Testimonials /> */}
        {/* <CTA /> */}

        {/* --- Area Konten Bawah (Dummy untuk test scroll) --- */}
        <section className="min-h-[100vh] p-8 text-center flex flex-col justify-center">
           <h2 className="text-3xl text-villa-900 font-serif mb-4">Area Konten Bawah</h2>
           <p className="text-charcoal max-w-2xl mx-auto">
             Scroll ke atas untuk melihat Hero Section. Perhatikan bagaimana Navbar berubah transparan saat berada di paling atas.
           </p>
        </section>

      </main>

      {/* <Footer /> */}
    </>
  );
}