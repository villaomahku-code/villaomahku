"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Users, BedDouble, MountainSnow, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { VillaRoom } from "@/types/schema";
import { getWhatsAppLink } from "@/data/config";

export default function Rooms() {
  const { language } = useLanguage();
  const [rooms, setRooms] = useState<VillaRoom[]>([]);
  const [loading, setLoading] = useState(true);

  // Hardcode Header Section karena tidak butuh fitur CRUD
  const content = {
    id: { eyebrow: "Eksplorasi Villa", heading: "Fasilitas & Kamar Tidur", buttonWa: "Reservasi Villa Ini" },
    en: { eyebrow: "Explore The Villa", heading: "Spaces & Bedrooms", buttonWa: "Book This Villa" }
  }[language];

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from("villa_rooms").select("*").order("created_at", { ascending: true });
      if (data) setRooms(data);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="rooms" className="relative w-full bg-villa-50 py-24 lg:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          variants={headerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
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
          <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-villa-300" /></div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12 text-charcoal/50">
            {language === "id" ? "Sedang menyiapkan data ruangan..." : "Preparing room data..."}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-16">
            {rooms.map((room, index) => {
              const name = language === "id" ? room.name_id : room.name_en;
              const desc = language === "id" ? room.description_id : room.description_en;
              
              // WA Message dibuat fokus ke 1 rumah villa
              const waMessage = language === "id" 
                ? `Halo Villa Omahku, saya tertarik dengan ${name} dan ingin bertanya tentang reservasi villanya.`
                : `Hello Villa Omahku, I'm interested in the ${name} and would like to ask about booking the villa.`;
              const waLink = getWhatsAppLink(waMessage);

              return (
                <motion.div
                  key={room.id} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} transition={{ delay: index * 0.2 }}
                  className="group flex flex-col overflow-hidden rounded-[2.5rem] bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image src={room.image_url} alt={name} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/70 to-transparent z-10" />
                  </div>

                  <div className="relative z-20 flex flex-1 flex-col p-8 md:p-10 pt-0 md:pt-0">
                    <h3 className="mb-4 font-serif text-2xl font-bold text-villa-900">{name}</h3>
                    
                    <div className="mb-6 flex flex-wrap gap-4 text-sm font-medium text-villa-700">
                      <span className="flex items-center gap-2 rounded-full bg-villa-50 px-3 py-1.5"><Users size={16} /> {room.capacity}</span>
                      <span className="flex items-center gap-2 rounded-full bg-villa-50 px-3 py-1.5"><BedDouble size={16} /> {room.bed_detail}</span>
                      <span className="flex items-center gap-2 rounded-full bg-villa-50 px-3 py-1.5"><MountainSnow size={16} /> {room.view_detail}</span>
                    </div>

                    <p className="mb-8 font-sans text-charcoal/80 leading-relaxed flex-1">{desc}</p>
                    
                    <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-villa-900 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-villa-600">
                      {content.buttonWa} <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}