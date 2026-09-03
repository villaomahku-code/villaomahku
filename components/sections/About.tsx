"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ABOUT_CONTENT } from "@/data/content";

export default function About({ data }: { data?: any }) {
  const { language } = useLanguage() as { language: "id" | "en" };
  const lang = language || "id";
  
  // Gunakan data dari props, fallback ke konten statis jika kosong
  const content = data?.[lang] || ABOUT_CONTENT[lang];
  // Pastikan URL gambar aman
  const bgImg = (data?.image_url && data.image_url !== "") ? data.image_url : "/images/about-img.jpg";

  const revealVariants: Variants = { 
    hidden: { opacity: 0, y: 50 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } } 
  };

  if (!content) return null;

  return (
    <section id="about" className="relative w-full overflow-hidden bg-cream py-24 lg:py-32">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
          
          {/* Kolom Gambar dengan Gradien Estetik */}
          <motion.div 
            variants={revealVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            className="relative order-2 lg:order-1 aspect-square w-full md:aspect-[4/3] lg:aspect-square"
          >
            {bgImg && (
               <Image 
                 src={bgImg} 
                 alt="About Villa" 
                 fill 
                 sizes="(max-width: 1024px) 100vw, 50vw" 
                 className="object-cover transition-transform duration-[3s] hover:scale-105" 
                 // Gunakan unoptimized sementara jika URL dari Supabase memicu error 500
                 unoptimized={bgImg.includes("supabase.co")} 
               />
            )}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-cream via-cream/80 to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-cream via-cream/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream via-cream/80 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream via-cream/80 to-transparent pointer-events-none" />
          </motion.div>

          {/* Kolom Teks */}
          <motion.div 
            variants={revealVariants} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true, margin: "-100px" }} 
            className="order-1 flex flex-col justify-center lg:order-2"
          >
            <span className="mb-4 text-sm font-semibold uppercase tracking-widest text-villa-500">
              {content.eyebrow}
            </span>
            <h2 className="mb-8 font-serif text-3xl font-bold leading-tight text-villa-900 md:text-5xl">
              {content.heading}
            </h2>
            <div className="space-y-6 font-sans text-base leading-relaxed text-charcoal/80 md:text-lg">
              {/* Fallback aman untuk array paragraf */}
              {content.paragraphs && Array.isArray(content.paragraphs) ? (
                content.paragraphs.map((text: string, index: number) => (
                  text ? <p key={index}>{text}</p> : null
                ))
              ) : (
                <p>Silakan lengkapi deskripsi di halaman Admin.</p>
              )}
            </div>
            <div className="mt-10">
              <a href="#experience" className="group flex items-center gap-2 border-b border-villa-900 w-fit pb-1 font-sans text-sm font-semibold uppercase tracking-wide text-villa-900 transition-colors hover:text-villa-500 hover:border-villa-500">
                {content.button || "Jelajahi"} <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
              </a>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}