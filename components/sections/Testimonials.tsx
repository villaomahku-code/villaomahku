"use client";

import { motion, Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { TESTIMONIALS_CONTENT } from "@/data/content";

export default function Testimonials() {
  const { language } = useLanguage();
  const content = TESTIMONIALS_CONTENT[language];

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full bg-cream py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="mb-16 md:mb-24 text-center"
        >
          <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-villa-500">
            {content.eyebrow}
          </span>
          <h2 className="font-serif text-3xl font-bold text-villa-900 md:text-5xl max-w-2xl mx-auto">
            {content.heading}
          </h2>
        </motion.div>

        {/* Scroll Horizontal (Slider tanpa library besar) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {content.reviews.map((review, index) => (
            <motion.div
              key={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, x: 50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: index * 0.2 } }
              }}
              className="snap-center shrink-0 w-[85vw] md:w-[400px] bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-villa-100"
            >
              <Quote className="text-villa-200 mb-6" size={40} />
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="fill-villa-400 text-villa-400" size={18} />
                ))}
              </div>
              <p className="font-sans text-charcoal/80 leading-relaxed italic mb-8 min-h-[120px]">
                "{review.text}"
              </p>
              <div className="flex items-center gap-4 border-t border-villa-100 pt-6">
                <div className="h-12 w-12 rounded-full bg-villa-100 flex items-center justify-center font-serif text-xl text-villa-700 font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-villa-900">{review.name}</h4>
                  <span className="font-sans text-xs text-charcoal/50">{review.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}