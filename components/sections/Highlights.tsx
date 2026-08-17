"use client";

import { motion, Variants } from "framer-motion";
import { BedDouble, MountainSnow, Wind, Leaf, Users, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { HIGHLIGHTS_CONTENT } from "@/data/content";

export default function Highlights() {
  const { language } = useLanguage();
  const content = HIGHLIGHTS_CONTENT[language];

  const getIcon = (id: string) => {
    const iconClass = "mb-5 text-villa-500 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-110";
    const size = 36;
    const stroke = 1.5;

    switch (id) {
      case "comfort": return <BedDouble className={iconClass} size={size} strokeWidth={stroke} />;
      case "nature": return <MountainSnow className={iconClass} size={size} strokeWidth={stroke} />;
      case "breeze": return <Wind className={iconClass} size={size} strokeWidth={stroke} />;
      case "privacy": return <Leaf className={iconClass} size={size} strokeWidth={stroke} />;
      case "family": return <Users className={iconClass} size={size} strokeWidth={stroke} />;
      case "access": return <MapPin className={iconClass} size={size} strokeWidth={stroke} />;
      default: return <Leaf className={iconClass} size={size} strokeWidth={stroke} />;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 text-center md:mb-24">
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-villa-500">
            {content.eyebrow}
          </span>
          <h2 className="font-serif text-3xl font-bold text-villa-900 md:text-5xl">
            {content.heading}
          </h2>
        </div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {content.items.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className="group flex flex-col rounded-3xl border border-villa-100/50 bg-cream/30 p-8 transition-all duration-300 hover:bg-cream hover:shadow-xl hover:shadow-villa-900/5"
            >
              {getIcon(item.id)}
              <h3 className="mb-3 font-serif text-xl font-semibold text-villa-900">
                {item.title}
              </h3>
              <p className="font-sans text-sm leading-relaxed text-charcoal/70">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}