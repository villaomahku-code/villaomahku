"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, UploadCloud, Save, LayoutTemplate, Type, AlignLeft, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { ABOUT_CONTENT, EXPERIENCE_CONTENT } from "@/data/content";

// Data Bawaan Hero
const DEFAULT_HERO = {
  id: { eyebrow: "Membangun Kenangan Indah", heading1: "Pulang Dengan", heading2: "Tenang,", heading3: "Menginap Dengan Nyaman.", desc: "Temukan ketenangan di Villa Omahku Sumberejo, tempat nyaman untuk menikmati udara sejuk, alam, dan waktu bersama orang-orang tersayang.", btn1: "Reservasi Sekarang", btn2: "Jelajahi Villa" },
  en: { eyebrow: "Building Beautiful Memories", heading1: "Return with", heading2: "Peace,", heading3: "Stay in Comfort.", desc: "Discover tranquility at Villa Omahku Sumberejo, a cozy place to enjoy the cool breeze, nature, and quality time with your loved ones.", btn1: "Book Now", btn2: "Explore Villas" }
};

export default function AdminPages() {
  const [activeTab, setActiveTab] = useState("hero");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // States: HERO
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroImg, setHeroImg] = useState("/images/hero-bg.jpg");
  const [heroData, setHeroData] = useState<any>(DEFAULT_HERO);

  // States: ABOUT
  const [aboutFile, setAboutFile] = useState<File | null>(null);
  const [aboutImg, setAboutImg] = useState("/images/about-img.jpg");
  // Pastikan ABOUT_CONTENT disalin secara mendalam (deep copy)
  const [aboutData, setAboutData] = useState<any>(JSON.parse(JSON.stringify(ABOUT_CONTENT)));

  // States: EXPERIENCE
  const [expFile, setExpFile] = useState<File | null>(null);
  const [expImg, setExpImg] = useState("/images/experience-1.jpg");
  const [expData, setExpData] = useState<any>(JSON.parse(JSON.stringify(EXPERIENCE_CONTENT)));

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("page_content").select("*");
      if (data) {
        data.forEach((row) => {
          if (row.section_name === "hero") {
            setHeroData(row.content_data || DEFAULT_HERO);
            if (row.image_url) setHeroImg(row.image_url);
          }
          if (row.section_name === "about") {
            setAboutData(row.content_data || ABOUT_CONTENT);
            if (row.image_url) setAboutImg(row.image_url);
          }
          if (row.section_name === "experience") {
            setExpData(row.content_data || EXPERIENCE_CONTENT);
            if (row.image_url) setExpImg(row.image_url);
          }
        });
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleTextChange = (section: string, lang: string, field: string, value: string) => {
    if (section === "hero") setHeroData((p: any) => ({ ...p, [lang]: { ...p[lang], [field]: value } }));
    if (section === "about") setAboutData((p: any) => ({ ...p, [lang]: { ...p[lang], [field]: value } }));
    if (section === "experience") setExpData((p: any) => ({ ...p, [lang]: { ...p[lang], [field]: value } }));
  };

  const handleArrayChange = (section: string, lang: string, arrayName: string, index: number, field: string | null, value: string) => {
    if (section === "about" && arrayName === "paragraphs") {
      setAboutData((p: any) => {
        // Amankan jika array belum ada
        const newArr = p[lang]?.paragraphs ? [...p[lang].paragraphs] : ["", ""];
        newArr[index] = value;
        return { ...p, [lang]: { ...p[lang], paragraphs: newArr } };
      });
    }
    if (section === "experience" && arrayName === "features" && field) {
      setExpData((p: any) => {
        const newArr = p[lang]?.features ? [...p[lang].features] : [];
        if (!newArr[index]) newArr[index] = {};
        newArr[index] = { ...newArr[index], [field]: value };
        return { ...p, [lang]: { ...p[lang], features: newArr } };
      });
    }
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      let finalImgUrl = section === "hero" ? heroImg : section === "about" ? aboutImg : expImg;
      const currentFile = section === "hero" ? heroFile : section === "about" ? aboutFile : expFile;
      const currentData = section === "hero" ? heroData : section === "about" ? aboutData : expData;

      if (currentFile) {
        const ext = currentFile.name.split('.').pop();
        const fileName = `${section}-${Math.random().toString(36).substring(2, 10)}.${ext}`;
        const filePath = `pages/${fileName}`;
        const { error: upErr } = await supabase.storage.from("omahku-media").upload(filePath, currentFile);
        if (upErr) throw upErr;
        const { data: { publicUrl } } = supabase.storage.from("omahku-media").getPublicUrl(filePath);
        finalImgUrl = publicUrl;
        
        if (section === "hero") { setHeroImg(finalImgUrl); setHeroFile(null); }
        if (section === "about") { setAboutImg(finalImgUrl); setAboutFile(null); }
        if (section === "experience") { setExpImg(finalImgUrl); setExpFile(null); }
      }

      const { error } = await supabase.from("page_content").upsert({
        section_name: section,
        content_data: currentData,
        image_url: finalImgUrl,
      });

      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 size={40} className="animate-spin text-villa-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Tampilan Halaman Depan</h1>
        <p className="text-charcoal/60 font-medium">Sesuaikan gambar latar dan copywriting (Bilingual) pada halaman utama website.</p>
      </motion.div>

      {/* Tabs */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }} className="flex flex-wrap gap-3 mb-8 border-b border-villa-100 pb-5">
        {[
          { id: "hero", label: "Hero Section" },
          { id: "about", label: "About Section" },
          { id: "experience", label: "Experience Section" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ${
              activeTab === tab.id 
                ? "bg-villa-600 text-white shadow-md shadow-villa-600/20" 
                : "bg-white text-villa-800 border border-villa-200 hover:bg-villa-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Form Area */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-6 md:p-8 rounded-3xl border border-villa-100 shadow-sm"
        >
          {/* --- FORM HERO --- */}
          {activeTab === "hero" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-villa-50 pb-4">
                <LayoutTemplate className="text-villa-600" size={24} />
                <h2 className="font-serif text-2xl font-bold text-villa-900">Hero Section (Atas)</h2>
              </div>

              {/* Upload Image */}
              <div className="relative w-full aspect-[21/9] md:aspect-[21/7] rounded-3xl border-2 border-dashed border-villa-300 bg-villa-50 overflow-hidden flex items-center justify-center group transition-all hover:border-villa-500">
                <input type="file" accept="image/*" onChange={(e) => { setHeroFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setHeroImg(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Image src={heroImg} alt="Hero" fill className="object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-300" unoptimized={heroImg.includes("supabase.co")} />
                <div className="relative z-10 flex flex-col items-center bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <UploadCloud size={28} className="mb-2 text-villa-600"/>
                  <span className="font-bold text-villa-900">Ubah Foto Hero</span>
                  <span className="text-xs text-charcoal/60 mt-1">Klik atau seret gambar ke sini</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {['id', 'en'].map(lang => (
                  <div key={lang} className="space-y-5 p-6 md:p-8 bg-villa-50/40 rounded-3xl border border-villa-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-villa-900 flex items-center gap-2">
                        <Type size={18} className="text-villa-500"/> 
                        Bahasa {lang === 'id' ? 'Indonesia' : 'Inggris'}
                      </h3>
                      <span className="px-3 py-1 bg-white border border-villa-200 rounded-full text-xs font-bold text-villa-600 uppercase">{lang}</span>
                    </div>

                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Eyebrow (Teks Kecil di Atas)</label><input type="text" value={heroData[lang]?.eyebrow || ""} onChange={(e)=>handleTextChange("hero", lang, "eyebrow", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Heading 1 (Baris Pertama)</label><input type="text" value={heroData[lang]?.heading1 || ""} onChange={(e)=>handleTextChange("hero", lang, "heading1", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Heading 2 (Baris Kedua Hijau)</label><input type="text" value={heroData[lang]?.heading2 || ""} onChange={(e)=>handleTextChange("hero", lang, "heading2", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Heading 3 (Baris Ketiga Italic)</label><input type="text" value={heroData[lang]?.heading3 || ""} onChange={(e)=>handleTextChange("hero", lang, "heading3", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Deskripsi Paragraf</label><textarea rows={4} value={heroData[lang]?.desc || ""} onChange={(e)=>handleTextChange("hero", lang, "desc", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white resize-none" /></div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Tombol 1 (Reservasi)</label><input type="text" value={heroData[lang]?.btn1 || ""} onChange={(e)=>handleTextChange("hero", lang, "btn1", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                      <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Tombol 2 (Explore)</label><input type="text" value={heroData[lang]?.btn2 || ""} onChange={(e)=>handleTextChange("hero", lang, "btn2", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-villa-100 flex justify-end">
                <button onClick={() => handleSave("hero")} disabled={isSaving} className="px-8 py-3.5 bg-villa-600 hover:bg-villa-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-villa-600/20 disabled:opacity-70">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : saveSuccess ? <CheckCircle2 size={20} /> : <Save size={20}/>} 
                  {isSaving ? "Menyimpan..." : saveSuccess ? "Tersimpan!" : "Simpan Perubahan Hero"}
                </button>
              </div>
            </div>
          )}

          {/* --- FORM ABOUT --- */}
          {activeTab === "about" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-villa-50 pb-4">
                <LayoutTemplate className="text-villa-600" size={24} />
                <h2 className="font-serif text-2xl font-bold text-villa-900">About Section (Tentang Kami)</h2>
              </div>

              <div className="relative w-full aspect-[4/3] md:aspect-[21/7] rounded-3xl border-2 border-dashed border-villa-300 bg-villa-50 overflow-hidden flex items-center justify-center group transition-all hover:border-villa-500">
                <input type="file" accept="image/*" onChange={(e) => { setAboutFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setAboutImg(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Image src={aboutImg} alt="About" fill className="object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-300" unoptimized={aboutImg.includes("supabase.co")} />
                <div className="relative z-10 flex flex-col items-center bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <UploadCloud size={28} className="mb-2 text-villa-600"/>
                  <span className="font-bold text-villa-900">Ubah Foto About</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {['id', 'en'].map(lang => (
                  <div key={lang} className="space-y-5 p-6 md:p-8 bg-villa-50/40 rounded-3xl border border-villa-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-villa-900 flex items-center gap-2">
                        <AlignLeft size={18} className="text-villa-500"/> 
                        Bahasa {lang === 'id' ? 'Indonesia' : 'Inggris'}
                      </h3>
                      <span className="px-3 py-1 bg-white border border-villa-200 rounded-full text-xs font-bold text-villa-600 uppercase">{lang}</span>
                    </div>

                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Eyebrow</label><input type="text" value={aboutData[lang]?.eyebrow || ""} onChange={(e)=>handleTextChange("about", lang, "eyebrow", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Judul Utama</label><input type="text" value={aboutData[lang]?.heading || ""} onChange={(e)=>handleTextChange("about", lang, "heading", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Paragraf 1</label><textarea rows={4} value={aboutData[lang]?.paragraphs?.[0] || ""} onChange={(e)=>handleArrayChange("about", lang, "paragraphs", 0, null, e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white resize-none" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Paragraf 2</label><textarea rows={4} value={aboutData[lang]?.paragraphs?.[1] || ""} onChange={(e)=>handleArrayChange("about", lang, "paragraphs", 1, null, e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white resize-none" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Teks Tombol</label><input type="text" value={aboutData[lang]?.button || ""} onChange={(e)=>handleTextChange("about", lang, "button", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-villa-100 flex justify-end">
                <button onClick={() => handleSave("about")} disabled={isSaving} className="px-8 py-3.5 bg-villa-600 hover:bg-villa-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-villa-600/20 disabled:opacity-70">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : saveSuccess ? <CheckCircle2 size={20} /> : <Save size={20}/>} 
                  {isSaving ? "Menyimpan..." : saveSuccess ? "Tersimpan!" : "Simpan Perubahan About"}
                </button>
              </div>
            </div>
          )}

          {/* --- FORM EXPERIENCE --- */}
          {activeTab === "experience" && (
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-villa-50 pb-4">
                <LayoutTemplate className="text-villa-600" size={24} />
                <h2 className="font-serif text-2xl font-bold text-villa-900">Experience Section (Pengalaman)</h2>
              </div>

              <div className="relative w-full aspect-[16/9] md:aspect-[21/7] rounded-3xl border-2 border-dashed border-villa-300 bg-villa-50 overflow-hidden flex items-center justify-center group transition-all hover:border-villa-500">
                <input type="file" accept="image/*" onChange={(e) => { setExpFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setExpImg(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                <Image src={expImg} alt="Experience" fill className="object-cover opacity-80 group-hover:opacity-50 transition-opacity duration-300" unoptimized={expImg.includes("supabase.co")} />
                <div className="relative z-10 flex flex-col items-center bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                  <UploadCloud size={28} className="mb-2 text-villa-600"/>
                  <span className="font-bold text-villa-900">Ubah Foto Pengalaman</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {['id', 'en'].map(lang => (
                  <div key={lang} className="space-y-5 p-6 md:p-8 bg-villa-50/40 rounded-3xl border border-villa-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-villa-900 flex items-center gap-2">
                        <Type size={18} className="text-villa-500"/> 
                        Bahasa {lang === 'id' ? 'Indonesia' : 'Inggris'}
                      </h3>
                      <span className="px-3 py-1 bg-white border border-villa-200 rounded-full text-xs font-bold text-villa-600 uppercase">{lang}</span>
                    </div>

                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Eyebrow</label><input type="text" value={expData[lang]?.eyebrow || ""} onChange={(e)=>handleTextChange("experience", lang, "eyebrow", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Judul Utama</label><input type="text" value={expData[lang]?.heading || ""} onChange={(e)=>handleTextChange("experience", lang, "heading", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white" /></div>
                    <div><label className="text-xs font-bold text-charcoal/80 block mb-2">Deskripsi Utama</label><textarea rows={3} value={expData[lang]?.desc || ""} onChange={(e)=>handleTextChange("experience", lang, "desc", e.target.value)} className="w-full text-sm px-4 py-3 rounded-xl border border-villa-200 focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all bg-white resize-none" /></div>
                    
                    {/* Features Array */}
                    <div className="space-y-4 pt-2">
                      <label className="text-xs font-bold text-charcoal/80 block mb-2">Poin-poin Pengalaman (Features)</label>
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="p-4 bg-white rounded-2xl border border-villa-200 space-y-3 shadow-sm hover:border-villa-300 transition-colors">
                          <p className="text-xs font-bold text-villa-600 uppercase tracking-wide">Poin {i+1}</p>
                          <input type="text" placeholder="Judul Poin (Maks. 3 Kata)" value={expData[lang]?.features?.[i]?.title || ""} onChange={(e)=>handleArrayChange("experience", lang, "features", i, "title", e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border border-villa-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all" />
                          <textarea rows={2} placeholder="Deskripsi Singkat" value={expData[lang]?.features?.[i]?.desc || ""} onChange={(e)=>handleArrayChange("experience", lang, "features", i, "desc", e.target.value)} className="w-full text-sm px-3 py-2 rounded-lg border border-villa-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-villa-500 transition-all resize-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-villa-100 flex justify-end">
                <button onClick={() => handleSave("experience")} disabled={isSaving} className="px-8 py-3.5 bg-villa-600 hover:bg-villa-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-villa-600/20 disabled:opacity-70">
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : saveSuccess ? <CheckCircle2 size={20} /> : <Save size={20}/>} 
                  {isSaving ? "Menyimpan..." : saveSuccess ? "Tersimpan!" : "Simpan Perubahan Experience"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}