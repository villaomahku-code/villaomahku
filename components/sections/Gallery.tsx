"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { GALLERY_CONTENT } from "@/data/content";
import { supabase } from "@/lib/supabase";
import { GalleryImage } from "@/types/schema";
import { Loader2 } from "lucide-react";

export default function Gallery() {
  const { language } = useLanguage();
  const content = GALLERY_CONTENT[language];
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setImages(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="gallery" className="relative w-full bg-white py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-20 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-villa-500">
            {content.eyebrow}
          </span>
          <h2 className="font-serif text-3xl font-bold text-villa-900 md:text-5xl">
            {content.heading}
          </h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin text-villa-300" />
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-charcoal/50 font-medium">
            {language === "id" ? "Belum ada foto galeri." : "No gallery photos yet."}
          </div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {images.map((image, index) => {
              // Membuat rasio selang-seling agar susunannya asimetris artistik
              const isTall = index % 3 === 0;
              const aspectRatio = isTall ? "aspect-[3/4]" : "aspect-[4/3]";
              const altText = language === "id" ? image.alt_text_id : image.alt_text_en;
              
              return (
                <motion.div
                  key={image.id}
                  variants={itemVariants}
                  className="group relative w-full overflow-hidden rounded-[2rem] break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className={`relative w-full ${aspectRatio}`}>
                    <Image
                      src={image.image_url}
                      alt={altText}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-villa-950/80 via-villa-950/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <p className="font-sans text-sm font-medium text-white drop-shadow-md">
                        {altText}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}