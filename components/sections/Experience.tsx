"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { EXPERIENCE_CONTENT } from "@/data/content";
import { supabase } from "@/lib/supabase";

export default function Experience() {
  const { language } = useLanguage();
  const [data, setData] = useState<any>(EXPERIENCE_CONTENT);
  const [bgImg, setBgImg] = useState("/images/experience-1.jpg");

  useEffect(() => {
    supabase.from("page_content").select("*").eq("section_name", "experience").single()
      .then(({ data: dbData }) => {
        if (dbData) {
          setData(dbData.content_data);
          if (dbData.image_url) setBgImg(dbData.image_url);
        }
      });
  }, []);

  const content = data[language] || EXPERIENCE_CONTENT[language];

  const fadeUp: Variants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
  const imageReveal: Variants = { hidden: { opacity: 0, scale: 1.02 }, visible: { opacity: 1, scale: 1, transition: { duration: 1.5, ease: "easeOut" } } };
  const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } };

  return (
    <section id="experience" className="relative flex w-full items-center bg-cream overflow-hidden py-24 lg:py-32">
      <motion.div variants={imageReveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="absolute inset-0 z-0 flex justify-start pointer-events-none">
        <div className="relative w-full h-full lg:w-[70%]">
          <Image src={bgImg} alt="Pengalaman di Villa Omahku" fill sizes="(max-width: 1024px) 100vw, 70vw" className="object-cover object-left" />
          <div className="absolute inset-y-0 right-0 w-full lg:w-[60%] bg-gradient-to-l from-cream via-cream/95 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-cream via-cream/80 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream via-cream/80 to-transparent" />
        </div>
      </motion.div>

      <div className="container mx-auto px-6 pr-8 md:pr-20 lg:pr-32 relative z-10 flex justify-end">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="w-full lg:w-[60%] xl:w-[50%] flex flex-col items-start text-left mt-64 lg:mt-0">
          <motion.span variants={fadeUp} className="mb-4 text-sm font-semibold uppercase tracking-widest text-villa-600">
            {content.eyebrow}
          </motion.span>
          <motion.h2 variants={fadeUp} className="mb-8 font-serif text-3xl font-bold leading-tight text-villa-950 md:text-5xl">
            {content.heading}
          </motion.h2>
          <motion.p variants={fadeUp} className="mb-12 font-sans text-base leading-relaxed text-charcoal/80 md:text-lg">
            {content.desc}
          </motion.p>
          <div className="flex flex-col gap-8 w-full">
            {content.features?.map((feature: any, index: number) => (
              <motion.div key={index} variants={fadeUp} className="flex flex-col border-l-2 border-villa-300 pl-6">
                <h3 className="mb-2 font-serif text-xl font-bold text-villa-900">{feature.title}</h3>
                <p className="font-sans text-sm text-charcoal/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}