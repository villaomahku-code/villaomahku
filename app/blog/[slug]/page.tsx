"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/schema";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ArticleReadPage() {
  const { slug } = useParams();
  const { language } = useLanguage();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (data) setArticle(data);
      setLoading(false);
    };
    if (slug) fetchArticle();
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-cream"><Loader2 size={40} className="animate-spin text-villa-600" /></div>;

  if (!article) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream text-center">
      <h1 className="text-3xl font-serif font-bold text-villa-900 mb-4">Artikel Tidak Ditemukan</h1>
      <Link href="/blog" className="text-villa-600 font-bold hover:underline">Kembali ke Blog</Link>
    </div>
  );

  const title = language === "id" ? article.title_id : article.title_en;
  const content = language === "id" ? article.content_id : article.content_en;
  const dateStr = new Date(article.created_at).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white pt-32 pb-24">
        <article className="container mx-auto px-6 md:px-12 max-w-4xl">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-villa-500 hover:text-villa-700 mb-10 transition-colors">
            <ArrowLeft size={16} /> {language === "id" ? "Kembali" : "Back to Blog"}
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs uppercase font-bold text-villa-400 tracking-widest">{dateStr}</span>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-villa-950 mt-4 mb-10 leading-tight">
              {title}
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-16 shadow-lg shadow-villa-900/5"
          >
            <Image src={article.image_url} alt={title} fill className="object-cover" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="prose prose-lg prose-villa max-w-none text-charcoal/80 leading-loose"
          >
            {/* Karena kita menyimpan teks pakai textarea, kita gunakan white-space: pre-wrap agar enter/paragrafnya terbaca */}
            <div className="whitespace-pre-wrap font-sans">
              {content}
            </div>
          </motion.div>

        </article>
      </main>
      <Footer />
    </>
  );
}