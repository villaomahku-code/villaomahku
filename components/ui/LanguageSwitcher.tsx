"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="relative flex h-8 w-16 items-center rounded-full border border-villa-100/20 bg-villa-900/10 p-1 backdrop-blur-md transition-colors hover:bg-villa-900/20 md:border-white/20 md:bg-white/10 md:hover:bg-white/20"
      aria-label="Toggle Language"
    >
      {/* Background Pill yang bergerak (Indikator Aktif) */}
      <motion.div
        className="absolute left-1 top-1 h-6 w-6 rounded-full bg-villa-500 shadow-sm"
        animate={{
          x: language === "id" ? 0 : 32, // Geser 32px ke kanan jika EN
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Ikon Bendera */}
      <div className="relative z-10 flex w-full justify-between px-1 text-sm">
        <span className={`transition-opacity duration-300 ${language === "id" ? "opacity-100" : "opacity-40 grayscale"}`}>
          🇮🇩
        </span>
        <span className={`transition-opacity duration-300 ${language === "en" ? "opacity-100" : "opacity-40 grayscale"}`}>
          🇬🇧
        </span>
      </div>
    </button>
  );
}