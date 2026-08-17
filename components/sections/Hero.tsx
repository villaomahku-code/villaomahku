"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { MapPin, Wind, Sparkles } from "lucide-react";
import { getWhatsAppLink, WA_MESSAGES } from "@/data/config";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

const DEFAULT_HERO = {
  id: { eyebrow: "Membangun Kenangan Indah", heading1: "Pulang Dengan", heading2: "Tenang,", heading3: "Menginap Dengan Nyaman.", desc: "Temukan ketenangan di Villa Omahku Sumberejo, tempat nyaman untuk menikmati udara sejuk, alam, dan waktu bersama orang-orang tersayang.", btn1: "Reservasi Sekarang", btn2: "Jelajahi Villa" },
  en: { eyebrow: "Building Beautiful Memories", heading1: "Return with", heading2: "Peace,", heading3: "Stay in Comfort.", desc: "Discover tranquility at Villa Omahku Sumberejo, a cozy place to enjoy the cool breeze, nature, and quality time with your loved ones.", btn1: "Book Now", btn2: "Explore Villas" }
};

export default function Hero() {
  const { language } = useLanguage();
  const waLink = getWhatsAppLink(WA_MESSAGES.booking);
  
  const [data, setData] = useState<any>(DEFAULT_HERO);
  const [bgImg, setBgImg] = useState("/images/hero-bg.jpg");

  useEffect(() => {
    supabase.from("page_content").select("*").eq("section_name", "hero").single()
      .then(({ data: dbData }) => {
        if (dbData) {
          setData(dbData.content_data);
          if (dbData.image_url) setBgImg(dbData.image_url);
        }
      });
  }, []);

  const content = data[language] || DEFAULT_HERO[language];

  const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
  const imageReveal: Variants = { hidden: { opacity: 0, scale: 1.02 }, visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" } } };
  const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };

  return (
    <section className="relative flex min-h-[100dvh] w-full items-center bg-white overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-0">
      <motion.div variants={imageReveal} initial="hidden" animate="visible" className="absolute inset-0 z-0 flex justify-end pointer-events-none">
        <div className="relative w-full h-full lg:w-full">
          <Image src={bgImg} alt="Hero Background" fill priority sizes="100vw" className="object-cover object-center lg:object-right" />
          <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-white via-white/95 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/50 to-transparent" />
        </div>
      </motion.div>

      <div className="container mx-auto px-6 pl-8 md:pl-20 lg:pl-32 relative z-10 flex">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="w-full lg:w-[60%] xl:w-[50%] flex flex-col items-start text-left mt-10 md:mt-0">
          <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2 rounded-full border border-villa-200 bg-white/50 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-[0.15em] text-villa-700 shadow-sm">
            <Sparkles size={14} className="text-villa-500" />
            <span className="font-semibold">{content.eyebrow}</span>
          </motion.div>
          <motion.h1 variants={fadeUp} className="mb-6 font-serif text-5xl font-bold leading-[1.1] text-villa-950 md:text-6xl lg:text-7xl">
            {content.heading1} <br />
            <span className="text-villa-600">{content.heading2}</span> <br className="hidden md:block" />
            <span className="font-light italic text-villa-800">{content.heading3}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mb-10 max-w-lg font-sans text-base font-medium leading-relaxed text-charcoal/80 md:text-lg">
            {content.desc}
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="rounded-full bg-villa-700 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-villa-600 hover:shadow-xl hover:shadow-villa-700/20 hover:-translate-y-0.5">{content.btn1}</a>
            <a href="#rooms" className="rounded-full border border-villa-300 bg-white/80 backdrop-blur-md px-8 py-4 text-sm font-medium text-villa-900 transition-all hover:bg-villa-50 hover:border-villa-400">{content.btn2}</a>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-villa-700/70">
            <span className="flex items-center gap-2"><MapPin size={16} /> Sumberejo</span>
            <span className="flex items-center gap-2"><Wind size={16} /> Udara Sejuk</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}