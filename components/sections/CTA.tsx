"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { CTA_CONTENT } from "@/data/content";
import { getWhatsAppLink, WA_MESSAGES } from "@/data/config";

export default function CTA() {
  const { language } = useLanguage();
  const content = CTA_CONTENT[language];

  const waPrimary = getWhatsAppLink(WA_MESSAGES.booking);
  const waSecondary = getWhatsAppLink(WA_MESSAGES.general);

  return (
    <section className="relative w-full py-32 overflow-hidden flex items-center justify-center min-h-[600px]">
      
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cta-bg.jpg"
          alt="Suasana tenang malam hari di Villa"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-villa-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-3xl mx-auto flex flex-col items-center"
        >
          <h2 className="font-serif text-4xl font-bold text-white md:text-6xl mb-6 leading-tight">
            {content.heading}
          </h2>
          <p className="font-sans text-lg text-villa-100 mb-12 leading-relaxed opacity-90">
            {content.desc}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
            <a
              href={waPrimary}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-villa-500 px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-villa-400 hover:shadow-xl hover:shadow-villa-500/20 hover:-translate-y-1 w-full sm:w-auto"
            >
              {content.btnPrimary}
            </a>
            <a
              href={waSecondary}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-10 py-4 text-sm font-semibold text-white transition-all hover:bg-white/10 w-full sm:w-auto"
            >
              {content.btnSecondary}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}