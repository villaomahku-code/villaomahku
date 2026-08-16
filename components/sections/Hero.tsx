"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { MapPin, Wind, Sparkles, ArrowDown } from "lucide-react";
import { getWhatsAppLink, WA_MESSAGES } from "@/data/config";
import MistEffect from "@/components/effects/MistEffect";

export default function Hero() {
  const waLink = getWhatsAppLink(WA_MESSAGES.booking);

  // Penambahan tipe : Variants agar TypeScript tidak protes
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)", 
      // Mengubah array angka menjadi string "easeOut" untuk kompatibilitas TS terbaik, 
      // visualnya akan tetap sama halusnya.
      transition: { duration: 1, ease: "easeOut" } 
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  return (
    <section className="relative flex h-[100dvh] min-h-[600px] w-full items-center justify-center overflow-hidden bg-villa-950">
      
      {/* --- BACKGROUND IMAGE --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Pemandangan Villa Omahku Sumberejo"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-villa-950/70 via-villa-900/40 to-villa-950/90" />
      </div>

      {/* --- MIST EFFECT --- */}
      <MistEffect />

      {/* --- KONTEN UTAMA --- */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 mt-16 flex flex-col items-center justify-center px-6 text-center md:px-12"
      >
        <motion.span 
          variants={fadeUp} 
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white backdrop-blur-md"
        >
          <Sparkles size={14} className="text-villa-300" />
          A Peaceful Stay in Sumberejo
        </motion.span>

        <motion.h1 
          variants={fadeUp} 
          className="mb-6 max-w-5xl font-serif text-4xl font-bold leading-[1.15] text-white md:text-6xl lg:text-7xl drop-shadow-lg"
        >
          Pulang Dengan Tenang, <br className="hidden md:block" />
          <span className="font-light italic text-villa-100">Menginap Dengan Nyaman.</span>
        </motion.h1>

        <motion.p 
          variants={fadeUp} 
          className="mb-10 max-w-2xl font-sans text-base font-light leading-relaxed text-villa-50 md:text-lg drop-shadow-md"
        >
          Temukan ketenangan di Villa Omahku Sumberejo, tempat nyaman untuk menikmati udara sejuk, alam, dan waktu bersama orang-orang tersayang.
        </motion.p>

        <motion.div variants={fadeUp} className="flex flex-col gap-4 sm:flex-row">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-villa-600 px-8 py-3.5 text-sm font-medium text-white transition-all hover:bg-villa-500 hover:shadow-lg hover:-translate-y-0.5"
          >
            Reservasi Sekarang
          </a>
          <a
            href="#rooms"
            className="rounded-full border border-white/30 bg-white/5 px-8 py-3.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/10"
          >
            Lihat Villa
          </a>
        </motion.div>

        <motion.div 
          variants={fadeUp} 
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs font-medium uppercase tracking-wider text-villa-200 opacity-80"
        >
          <span className="flex items-center gap-2"><MapPin size={16} /> Sumberejo</span>
          <span className="flex items-center gap-2"><Wind size={16} /> Udara Sejuk</span>
          <span className="flex items-center gap-2"><Sparkles size={16} /> Private Villa</span>
        </motion.div>
      </motion.div>

      {/* --- SCROLL INDICATOR --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-widest">Scroll</span>
        <ArrowDown size={16} className="animate-bounce" />
      </motion.div>

    </section>
  );
}