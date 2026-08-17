"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/schema";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-32 pb-24">
        {/* Header Blog */}
        <div className="container mx-auto px-6 md:px-12 mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl font-bold text-villa-950 mb-6"
          >
            {language === "id" ? "Jurnal Omahku" : "Omahku Journal"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-charcoal/70 max-w-2xl mx-auto font-medium"
          >
            {language === "id" 
              ? "Kumpulan cerita, promo, dan inspirasi liburan dari Villa Omahku Sumberejo." 
              : "A collection of stories, promos, and holiday inspiration from Villa Omahku Sumberejo."}
          </motion.p>
        </div>

        {/* Grid Semua Artikel */}
        <div className="container mx-auto px-6 md:px-12">
          {loading ? (
            <div className="flex justify-center py-20"><Loader2 size={40} className="animate-spin text-villa-400" /></div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-charcoal/50">Belum ada artikel.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => {
                const title = language === "id" ? article.title_id : article.title_en;
                const excerpt = language === "id" ? article.content_id : article.content_en;
                const dateStr = new Date(article.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

                return (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-villa-100"
                  >
                    <Link href={`/blog/${article.slug}`} className="relative aspect-[4/3] w-full overflow-hidden block">
                      <Image src={article.image_url} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </Link>
                    <div className="p-8 flex flex-col flex-1">
                      <span className="text-[10px] uppercase font-bold text-villa-400 mb-3 tracking-widest">{dateStr}</span>
                      <Link href={`/blog/${article.slug}`}>
                        <h3 className="font-serif text-xl font-bold text-villa-900 mb-4 line-clamp-2 group-hover:text-villa-600 transition-colors">{title}</h3>
                      </Link>
                      <p className="font-sans text-sm text-charcoal/70 line-clamp-3 flex-1">{excerpt}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}