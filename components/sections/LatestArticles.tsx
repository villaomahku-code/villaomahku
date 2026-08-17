"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/schema";
import { ArrowRight, Loader2 } from "lucide-react";

export default function LatestArticles() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      // Hanya mengambil 3 artikel terbaru
      const { data } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (data) setArticles(data);
      setLoading(false);
    };
    fetchArticles();
  }, []);

  // Jangan tampilkan seksi ini jika belum ada artikel sama sekali
  if (!loading && articles.length === 0) return null;

  return (
    <section className="relative w-full bg-cream py-24 lg:py-32 overflow-hidden border-t border-villa-100">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-widest text-villa-500">
              {language === "id" ? "Jurnal Omahku" : "Omahku Journal"}
            </span>
            <h2 className="font-serif text-3xl font-bold text-villa-900 md:text-5xl">
              {language === "id" ? "Kabar & Cerita Terbaru" : "Latest News & Stories"}
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/blog"
              className="group flex items-center gap-2 border-b border-villa-900 pb-1 font-sans text-sm font-bold uppercase tracking-wide text-villa-900 transition-colors hover:text-villa-500 hover:border-villa-500"
            >
              {language === "id" ? "Lihat Semua Artikel" : "View All Articles"}
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 size={40} className="animate-spin text-villa-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article, index) => {
              const title = language === "id" ? article.title_id : article.title_en;
              const excerpt = language === "id" ? article.content_id : article.content_en;
              const dateStr = new Date(article.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', {
                day: 'numeric', month: 'long', year: 'numeric'
              });

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.15 }}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-villa-100"
                >
                  <Link href={`/blog/${article.slug}`} className="relative aspect-[4/3] w-full overflow-hidden block">
                    <Image
                      src={article.image_url}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <span className="text-[10px] uppercase font-bold text-villa-400 mb-3 tracking-widest">
                      {dateStr}
                    </span>
                    <Link href={`/blog/${article.slug}`}>
                      <h3 className="font-serif text-xl font-bold text-villa-900 mb-4 line-clamp-2 group-hover:text-villa-600 transition-colors">
                        {title}
                      </h3>
                    </Link>
                    <p className="font-sans text-sm text-charcoal/70 line-clamp-3 mb-6 flex-1 leading-relaxed">
                      {excerpt}
                    </p>
                    <Link 
                      href={`/blog/${article.slug}`}
                      className="text-sm font-bold text-villa-700 flex items-center gap-2 group-hover:text-villa-500"
                    >
                      {language === "id" ? "Baca Selengkapnya" : "Read More"}
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}