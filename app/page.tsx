import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Highlights from "@/components/sections/Highlights";
import Rooms from "@/components/sections/Rooms";
import Facilities from "@/components/sections/Facilities";
import Gallery from "@/components/sections/Gallery";
import Experience from "@/components/sections/Experience";
import Location from "@/components/sections/Location";
import LatestArticles from "@/components/sections/LatestArticles"; // <-- Komponen Baru
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-cream">
        <Hero /> 
        <About />
        <Highlights />
        <Rooms />
        <Facilities />
        <Gallery />
        <Experience />
        <Location />
        <LatestArticles /> {/* <-- Ditambahkan di sini */}
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </>
  );
}