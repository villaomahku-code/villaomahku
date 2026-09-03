"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BedDouble, MountainSnow, View, X, Sparkles, MapPin, Maximize2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getWhatsAppLink } from "@/data/config";
import dynamic from "next/dynamic";
const VirtualTour = dynamic(() => import("@/components/ui/VirtualTour"), { 
  ssr: false, 
  loading: () => <div className="flex items-center justify-center h-full text-white text-xs tracking-widest uppercase">Memuat VR 360...</div> 
});

const FadeUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }} className={className}>
    {children}
  </motion.div>
);

export default function Rooms({ data }: { data?: any[] }) {
  const { language } = useLanguage() as { language: "id" | "en" };
  const lang = language || "id";
  
  const [selected360, setSelected360] = useState<string | null>(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  const content = {
    id: { eyebrow: "Eksplorasi Villa", heading: "Fasilitas & Kamar Tidur", buttonWa: "Reservasi" },
    en: { eyebrow: "Explore The Villa", heading: "Spaces & Bedrooms", buttonWa: "Book" }
  }[lang];

  if (!data || data.length === 0) return null;

  return (
    <section id="rooms" className="py-24 md:py-32 bg-cream-100 text-charcoal px-6">
      <div className="max-w-7xl mx-auto">
        
        <FadeUp className="text-center mb-16 md:mb-24">
          <h3 className="text-villa-500 font-bold tracking-[0.2em] uppercase text-xs mb-4">{content.eyebrow}</h3>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-villa-900">{content.heading}</h2>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {data.map((room, idx) => {
            const name = lang === "id" ? room.name_id : room.name_en;
            const desc = lang === "id" ? room.description_id : room.description_en;
            const capacity = lang === "id" ? room.capacity_id : room.capacity_en;
            const bedDetail = lang === "id" ? room.bed_detail_id : room.bed_detail_en;
            const viewDetail = lang === "id" ? room.view_detail_id : room.view_detail_en;
            const isFacility = room.category === 'facility';
            const waLink = getWhatsAppLink(`Halo Villa Omahku, saya tertarik dengan ${isFacility ? 'Fasilitas' : 'Kamar tipe'} ${name} dan ingin bertanya lebih detail.`);

            return (
              <FadeUp key={room.id} delay={idx * 0.1}>
                <div className="group flex flex-col h-full bg-white rounded-3xl p-5 border border-villa-200 shadow-sm hover:shadow-xl hover:border-villa-300 transition-all">
                  
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl mb-6 shadow-md">
                    <Image src={room.image_url} alt={name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                    {room.image_360_url && (
                      <button onClick={() => setSelected360(room.image_360_url!)} className="absolute top-4 left-4 bg-white/70 hover:bg-white text-villa-900 backdrop-blur-md border border-white/50 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                        <View size={14} /> 360° View
                      </button>
                    )}
                    <div className="absolute bottom-4 right-4 bg-villa-500 text-white text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {isFacility ? (lang === 'id' ? 'Fasilitas' : 'Facility') : (lang === 'id' ? 'Kamar' : 'Bedroom')}
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1">
                    <h3 className="text-2xl font-serif font-bold text-villa-900 group-hover:text-villa-600 transition-colors mb-3">{name}</h3>
                    <p className="text-charcoal/70 text-sm line-clamp-3 leading-relaxed font-light mb-6 flex-1">{desc}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-villa-700 pt-4 border-t border-villa-100">
                      <span className="flex items-center gap-1.5 bg-villa-50 px-3 py-1.5 rounded-full ring-1 ring-villa-200">
                        <Users size={14}/> {capacity || room.capacity || "-"}
                      </span>
                      <span className="flex items-center gap-1.5 bg-villa-50 px-3 py-1.5 rounded-full ring-1 ring-villa-200">
                        {isFacility ? <Sparkles size={14}/> : <BedDouble size={14}/>} {bedDetail || room.bed_detail || "-"}
                      </span>
                      <span className="flex items-center gap-1.5 bg-villa-50 px-3 py-1.5 rounded-full ring-1 ring-villa-200">
                        {isFacility ? <MapPin size={14}/> : <MountainSnow size={14}/>} {viewDetail || room.view_detail || "-"}
                      </span>
                    </div>

                    {room.gallery_urls && room.gallery_urls.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-villa-100">
                        <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-widest mb-3">Lebih Banyak Foto</p>
                        <div className="grid grid-cols-3 gap-2">
                          {room.gallery_urls.map((url: string, i: number) => (
                            <div key={i} onClick={() => setSelectedGalleryImage(url)} className="relative aspect-square rounded-xl overflow-hidden cursor-zoom-in group/img ring-1 ring-villa-200 hover:ring-villa-400 transition-all">
                              {/* Perbaikan Peringatan "sizes" di sini */}
                              <Image src={url} alt={`Gallery ${i}`} fill sizes="(max-width: 768px) 30vw, 10vw" className="object-cover group-hover/img:scale-110 transition-transform duration-500" />
                              <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                                <Maximize2 size={16} className="text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-villa-500 hover:bg-villa-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors border border-transparent hover:shadow-lg hover:shadow-villa-500/30">
                        {content.buttonWa}
                      </a>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedGalleryImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedGalleryImage(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-10 cursor-zoom-out">
            <button onClick={() => setSelectedGalleryImage(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-full transition-colors z-50"><X size={24} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <Image src={selectedGalleryImage} alt="Enlarged" fill sizes="100vw" className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected360 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-10">
            <div className="relative w-full h-full max-w-7xl max-h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <button onClick={() => setSelected360(null)} className="absolute top-6 right-6 z-50 p-3 bg-white/10 hover:bg-red-500 text-white rounded-full transition-colors"><X size={24} /></button>
              <div className="absolute top-6 left-6 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md flex items-center gap-2 pointer-events-none"><View size={16} /> Geser layar untuk melihat</div>
              <VirtualTour imageUrl={selected360} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}