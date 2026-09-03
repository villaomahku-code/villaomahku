"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { GALLERY_CONTENT } from "@/data/content";
import { GalleryImage } from "@/types/schema";
import { Maximize2, X, ChevronDown, Sparkles } from "lucide-react";

export default function Gallery({ data }: { data: GalleryImage[] }) {
  const { language } = useLanguage() as { language: "id" | "en" };
  const lang = language || "id";
  const content = GALLERY_CONTENT[lang];
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const heightClasses = [
    "h-[300px]", "h-[450px]", "h-[350px]", 
    "h-[500px]", "h-[400px]", "h-[300px]"
  ];

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  const visibleImages = data?.slice(0, visibleCount) || [];
  const hasMore = data && visibleCount < data.length;

  return (
    <section id="gallery" className="relative w-full bg-cream-50 py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream to-transparent pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
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

        {!data || data.length === 0 ? (
          <div className="text-center py-12 text-charcoal/50 font-medium">
            {lang === "id" ? "Belum ada foto galeri." : "No gallery photos yet."}
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              <AnimatePresence>
                {visibleImages.map((image, index) => {
                  const altText = lang === "id" ? image.alt_text_id : image.alt_text_en;
                  
                  return (
                    <motion.div
                      key={image.id}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-50px" }}
                      onClick={() => setSelectedImage(image.image_url)}
                      className={`group relative w-full ${heightClasses[index % heightClasses.length]} overflow-hidden rounded-3xl break-inside-avoid shadow-sm hover:shadow-2xl hover:shadow-villa-500/20 transition-all duration-500 cursor-zoom-in`}
                    >
                      {/* Perbaikan Peringatan "sizes" di sini */}
                      <Image
                        src={image.image_url}
                        alt={altText}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 bg-villa-900/0 group-hover:bg-villa-900/30 transition-colors duration-500 flex flex-col items-center justify-center">
                        <Maximize2 size={36} className="text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl" />
                      </div>

                      <div className="absolute inset-x-0 bottom-0 p-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-villa-900/80 to-transparent pointer-events-none">
                        <p className="font-sans text-sm font-medium text-white drop-shadow-md">
                          {altText}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {hasMore && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mt-16 flex justify-center relative z-20"
                >
                  <button
                    onClick={handleLoadMore}
                    className="group relative inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-villa-900 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-villa-200 transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:ring-villa-400"
                  >
                    <Sparkles size={16} className="text-villa-500" />
                    <span>{lang === "id" ? "Lihat Lebih Banyak" : "View More Memories"}</span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-villa-50 text-villa-600 transition-colors group-hover:bg-villa-100 group-hover:text-villa-900">
                      <ChevronDown size={18} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                    </span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 sm:p-10 cursor-zoom-out"
          >
            <button 
              onClick={() => setSelectedImage(null)} 
              className="absolute top-6 right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-50"
            >
              <X size={24} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Perbaikan Peringatan "sizes" di sini */}
              <Image 
                src={selectedImage} 
                alt="Enlarged view" 
                fill 
                sizes="100vw"
                className="object-contain" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}