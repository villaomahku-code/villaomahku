"use client";

import { motion, Variants } from "framer-motion";
import { Wifi, ChefHat, Car, Bath, Flame, TreePine } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { FACILITIES_CONTENT } from "@/data/content";

export default function Facilities() {
  const { language } = useLanguage();
  const content = FACILITIES_CONTENT[language];

  const getIcon = (id: string) => {
    const iconClass = "text-villa-600 mb-4 transition-transform duration-500 group-hover:scale-110";
    const size = 32;
    const stroke = 1.5;

    switch (id) {
      case "wifi": return <Wifi className={iconClass} size={size} strokeWidth={stroke} />;
      case "kitchen": return <ChefHat className={iconClass} size={size} strokeWidth={stroke} />;
      case "parking": return <Car className={iconClass} size={size} strokeWidth={stroke} />;
      case "water": return <Bath className={iconClass} size={size} strokeWidth={stroke} />;
      case "bbq": return <Flame className={iconClass} size={size} strokeWidth={stroke} />;
      case "garden": return <TreePine className={iconClass} size={size} strokeWidth={stroke} />; // Ikon baru untuk Kebun
      default: return <Wifi className={iconClass} size={size} strokeWidth={stroke} />;
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section id="facilities" className="relative w-full bg-cream py-24 lg:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row lg:items-end lg:gap-24">
          
          <div className="max-w-xl text-center lg:text-left">
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-villa-500">
              {content.eyebrow}
            </span>
            <h2 className="mb-6 font-serif text-3xl font-bold text-villa-900 md:text-5xl">
              {content.heading}
            </h2>
            <p className="font-sans text-base leading-relaxed text-charcoal/80 md:text-lg">
              {content.desc}
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:w-1/2"
          >
            {content.items.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="group flex flex-col items-center justify-center rounded-2xl border border-villa-200/50 bg-white p-6 text-center shadow-sm transition-all hover:border-villa-300 hover:shadow-md"
              >
                {getIcon(item.id)}
                <span className="font-sans text-sm font-medium text-villa-900">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}