export const runtime = 'edge';

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
import LatestArticles from "@/components/sections/LatestArticles";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";
import { supabase } from "@/lib/supabase";

// Mengubah revalidate ke 0 (Real-time) agar setiap kali halaman di-refresh, 
// urutan foto langsung mengikuti perubahan terbaru dari database Admin.
export const revalidate = 0;

export default async function Home() {
  // Ambil semua data CMS secara paralel dari Server
  const [pagesRes, roomsRes, galleryRes] = await Promise.all([
    supabase.from("page_content").select("*"),
    
    supabase.from("villa_rooms").select("*").order("created_at", { ascending: true }),
    
    // PERBAIKAN DI SINI: Memanggil galeri berdasarkan "sort_order" terlebih dahulu
    supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true }) 
      .order("created_at", { ascending: false })
  ]);

  // Format data halaman depan agar mudah dibaca komponen
  const pageData: any = {};
  if (pagesRes.data) {
    pagesRes.data.forEach(item => {
      pageData[item.section_name] = { ...item.content_data, image_url: item.image_url };
    });
  }

  return (
    <>
      <Navbar />

      <main className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-cream selection:bg-villa-900 selection:text-white">
        <Hero data={pageData.hero} /> 
        <About data={pageData.about} />
        <Highlights />
        <Rooms data={roomsRes.data || []} />
        <Facilities />
        <Gallery data={galleryRes.data || []} />
        <Experience data={pageData.experience} />
        <Location />
        <LatestArticles />
        <Testimonials />
        <CTA />
      </main>

      <Footer />
    </>
  );
}