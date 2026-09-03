"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { MapPin, Wind, Sparkles, X, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const DEFAULT_HERO = {
  id: { eyebrow: "Membangun Kenangan Indah", heading1: "Pulang Dengan", heading2: "Tenang,", heading3: "Menginap Dengan Nyaman.", desc: "Temukan ketenangan di Villa Omahku Sumberejo, tempat nyaman untuk menikmati udara sejuk, alam, dan waktu bersama orang-orang tersayang.", btn1: "Reservasi Sekarang", btn2: "Jelajahi Villa" },
  en: { eyebrow: "Building Beautiful Memories", heading1: "Return with", heading2: "Peace,", heading3: "Stay in Comfort.", desc: "Discover tranquility at Villa Omahku Sumberejo, a cozy place to enjoy the cool breeze, nature, and quality time with your loved ones.", btn1: "Book Now", btn2: "Explore Villas" }
};

export default function Hero({ data }: { data: any }) {
  const { language } = useLanguage() as { language: "id" | "en" };
  const lang = language || "id";
  
  const content = data?.[lang] || DEFAULT_HERO[lang];
  const bgImg = data?.image_url || "/images/hero-bg.jpg";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", checkIn: "", checkOut: "", adults: "2", children: "0" });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Halo Omah'ku Sumberejo, saya ingin menanyakan ketersediaan villa.%0A%0A*Nama:* ${form.name}%0A*Check-in:* ${form.checkIn}%0A*Check-out:* ${form.checkOut}%0A*Dewasa:* ${form.adults} Orang%0A*Anak:* ${form.children} Orang%0A%0AApakah tanggal tersebut tersedia?`;
    window.open(`https://wa.me/6281130700050?text=${msg}`, '_blank');
    setIsModalOpen(false);
  };

  const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
  const imageReveal: Variants = { hidden: { opacity: 0, scale: 1.05 }, visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" } } };

  return (
    <>
      <section className="relative flex min-h-[100dvh] w-full items-center bg-cream overflow-hidden pt-24 pb-12 lg:pt-32 lg:pb-0">
        
        <motion.div variants={imageReveal} initial="hidden" animate="visible" className="absolute inset-0 z-0 flex justify-end pointer-events-none">
          <div className="relative w-full h-full lg:w-full">
            {/* Perbaikan Peringatan "sizes" di sini */}
            <Image src={bgImg} alt="Hero Background" fill priority sizes="100vw" className="object-cover object-center lg:object-right" />
            <div className="absolute inset-y-0 left-0 w-full lg:w-[60%] bg-gradient-to-r from-cream via-cream/95 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cream via-cream/80 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream via-cream/50 to-transparent" />
          </div>
        </motion.div>

        <motion.div
          animate={{ x: ["-5%", "5%", "-5%"], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -left-[10%] -right-[10%] h-[50vh] bg-gradient-to-t from-cream via-white/60 to-transparent blur-3xl z-10 pointer-events-none"
        />
        <motion.div
          animate={{ x: ["5%", "-5%", "5%"], opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 20, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[10%] -left-[20%] -right-[20%] h-[40vh] bg-gradient-to-t from-white via-cream/50 to-transparent blur-2xl z-10 pointer-events-none mix-blend-overlay"
        />

        <div className="container mx-auto px-6 pl-6 md:pl-20 lg:pl-32 relative z-20 flex">
          <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.15, delayChildren: 0.2 }} className="w-full lg:w-[60%] xl:w-[50%] flex flex-col items-start text-left mt-10 md:mt-0">
            
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2 rounded-full border border-villa-200 bg-white/60 backdrop-blur-md px-4 py-2 text-xs uppercase tracking-[0.15em] text-villa-700 shadow-sm">
              <Sparkles size={14} className="text-villa-500" />
              <span className="font-semibold">{content.eyebrow}</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="mb-6 font-serif text-5xl font-bold leading-[1.1] text-villa-950 md:text-6xl lg:text-7xl">
              {content.heading1} <br />
              <span className="text-villa-500">{content.heading2}</span> <br className="hidden md:block" />
              <span className="font-light italic text-charcoal">{content.heading3}</span>
            </motion.h1>
            
            <motion.p variants={fadeUp} className="mb-10 max-w-lg font-sans text-base font-medium leading-relaxed text-charcoal/80 md:text-lg relative z-20">
              {content.desc}
            </motion.p>
            
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row w-full sm:w-auto items-center gap-4 relative z-30">
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="w-full sm:w-auto rounded-full bg-villa-900 px-8 py-4 text-sm font-medium text-white transition-all hover:bg-villa-800 hover:shadow-xl hover:shadow-villa-900/20 hover:-translate-y-0.5"
              >
                {content.btn1}
              </button>
              <a href="#rooms" className="w-full sm:w-auto text-center rounded-full border border-villa-300 bg-white/80 backdrop-blur-md px-8 py-4 text-sm font-medium text-villa-900 transition-all hover:bg-villa-50 hover:border-villa-400">
                {content.btn2}
              </a>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-charcoal/60">
              <span className="flex items-center gap-2"><MapPin size={16} /> Sumberejo</span>
              <span className="flex items-center gap-2"><Wind size={16} /> Udara Sejuk</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto border border-villa-100"
            >
              <div className="bg-cream-100 p-6 text-villa-900 border-b border-villa-200 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-serif font-bold text-2xl">Formulir Reservasi</h3>
                  <p className="text-sm text-charcoal/70 mt-1">Isi data untuk cek ketersediaan via WhatsApp</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="relative z-10 p-2 hover:bg-white rounded-full transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleBookSubmit} className="p-6 md:p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-villa-900 mb-2">Nama Lengkap</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full bg-cream-50 border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-400 outline-none transition-all" placeholder="Masukkan nama Anda" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-villa-900 mb-2">Check-in</label>
                    <input type="date" required value={form.checkIn} onChange={(e) => setForm({...form, checkIn: e.target.value})} className="w-full bg-cream-50 border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-400 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-villa-900 mb-2">Check-out</label>
                    <input type="date" required value={form.checkOut} onChange={(e) => setForm({...form, checkOut: e.target.value})} className="w-full bg-cream-50 border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-400 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-villa-900 mb-2">Dewasa</label>
                    <input type="number" min="1" required value={form.adults} onChange={(e) => setForm({...form, adults: e.target.value})} className="w-full bg-cream-50 border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-400 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-villa-900 mb-2">Anak-anak</label>
                    <input type="number" min="0" required value={form.children} onChange={(e) => setForm({...form, children: e.target.value})} className="w-full bg-cream-50 border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-400 outline-none transition-all" />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-villa-900 hover:bg-villa-800 text-white py-4 rounded-xl font-bold transition-all shadow-md">
                    <Send size={18} /> Kirim Enquiry ke WhatsApp
                  </button>
                  <p className="text-center text-xs text-charcoal/50 mt-4">Anda akan diarahkan ke WhatsApp Admin Omah'ku Sumberejo.</p>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}