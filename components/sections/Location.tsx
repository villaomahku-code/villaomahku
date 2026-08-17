"use client";

import { motion, Variants } from "framer-motion";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LOCATION_CONTENT } from "@/data/content";
import { SITE_CONFIG } from "@/data/config";

export default function Location() {
  const { language } = useLanguage();
  const content = LOCATION_CONTENT[language];

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="location" className="relative w-full bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">
          
          {/* Teks Lokasi di Kiri */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="w-full lg:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-villa-500">
              {content.eyebrow}
            </span>
            <h2 className="mb-6 font-serif text-3xl font-bold text-villa-900 md:text-5xl">
              {content.heading}
            </h2>
            <p className="mb-8 font-sans text-base leading-relaxed text-charcoal/80 md:text-lg">
              {content.desc}
            </p>

            <div className="flex items-center gap-4 mb-10 text-villa-800 bg-villa-50 py-4 px-6 rounded-2xl w-full">
              <MapPin className="text-villa-500 flex-shrink-0" size={24} />
              <span className="font-medium text-sm text-left leading-relaxed">
                {SITE_CONFIG.address}
              </span>
            </div>

            <a
              href={SITE_CONFIG.contact.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-villa-900 px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-villa-600 shadow-md"
            >
              {content.btn}
              <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </a>
          </motion.div>

          {/* Google Maps Embed di Kanan */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="w-full lg:w-[60%] h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-villa-900/10 border border-villa-100 p-2 bg-cream/30"
          >
            <div className="w-full h-full rounded-[2rem] overflow-hidden">
              <iframe
                src="https://maps.google.com/maps?q=Villa%20Omah'ku%20Sumberejo&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale-[20%] contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}