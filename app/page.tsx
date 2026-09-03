export const runtime = 'edge';
export const dynamic = 'force-dynamic'; // Cara yang lebih direkomendasikan untuk Edge Next.js

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

export default async function Home() {
  try {
    // Ambil semua data CMS secara paralel dari Server
    const [pagesRes, roomsRes, galleryRes] = await Promise.all([
      supabase.from("page_content").select("*"),
      
      supabase.from("villa_rooms").select("*").order("created_at", { ascending: true }),
      
      supabase
        .from("gallery_images")
        .select("*")
        .order("sort_order", { ascending: true }) 
        .order("created_at", { ascending: false })
    ]);

    // Jika terjadi error dari Supabase, lemparkan agar ditangkap oleh catch
    if (pagesRes.error) throw pagesRes.error;
    if (roomsRes.error) throw roomsRes.error;
    if (galleryRes.error) throw galleryRes.error;

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
  } catch (error: any) {
    // SABUK PENGAMAN: Jika server crash, tampilkan kotak error ke layar (Bukan memunculkan favicon)
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-charcoal p-6">
        <div className="p-8 bg-white rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-100">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Gagal Memuat Database</h1>
          <p className="mb-6 text-sm text-charcoal/70">
            Terjadi masalah saat server Cloudflare mencoba terhubung ke Supabase.
          </p>
          <div className="bg-red-50 text-red-800 p-4 rounded-xl text-left text-xs overflow-auto font-mono">
            {error.message || "Unknown error occurred"}
          </div>
        </div>
      </div>
    );
  }
}