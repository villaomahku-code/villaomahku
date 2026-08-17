"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2, UploadCloud, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
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

  // States: HERO
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroImg, setHeroImg] = useState("/images/hero-bg.jpg");
  const [heroData, setHeroData] = useState<any>(DEFAULT_HERO);

  // States: ABOUT
  const [aboutFile, setAboutFile] = useState<File | null>(null);
  const [aboutImg, setAboutImg] = useState("/images/about-img.jpg");
  const [aboutData, setAboutData] = useState<any>(ABOUT_CONTENT);

  // States: EXPERIENCE
  const [expFile, setExpFile] = useState<File | null>(null);
  const [expImg, setExpImg] = useState("/images/experience-1.jpg");
  const [expData, setExpData] = useState<any>(EXPERIENCE_CONTENT);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("page_content").select("*");
      if (data) {
        data.forEach((row) => {
          if (row.section_name === "hero") {
            setHeroData(row.content_data);
            if (row.image_url) setHeroImg(row.image_url);
          }
          if (row.section_name === "about") {
            setAboutData(row.content_data);
            if (row.image_url) setAboutImg(row.image_url);
          }
          if (row.section_name === "experience") {
            setExpData(row.content_data);
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
        const newArr = [...p[lang].paragraphs];
        newArr[index] = value;
        return { ...p, [lang]: { ...p[lang], paragraphs: newArr } };
      });
    }
    if (section === "experience" && arrayName === "features" && field) {
      setExpData((p: any) => {
        const newArr = [...p[lang].features];
        newArr[index] = { ...newArr[index], [field]: value };
        return { ...p, [lang]: { ...p[lang], features: newArr } };
      });
    }
  };

  const handleSave = async (section: string) => {
    setIsSaving(true);
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
      alert(`Berhasil menyimpan perubahan di bagian ${section.toUpperCase()}!`);
    } catch (err: any) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-villa-400" /></div>;

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Tampilan Halaman Depan</h1>
      <p className="text-charcoal/60 font-medium mb-8">Sesuaikan gambar latar dan copywriting (ID & EN) pada halaman depan.</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-villa-100 pb-4">
        {["hero", "about", "experience"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${activeTab === tab ? "bg-villa-900 text-white shadow-md" : "bg-white text-villa-600 hover:bg-villa-50"}`}
          >
            Section {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-villa-100 shadow-sm">
        
        {/* --- FORM HERO --- */}
        {activeTab === "hero" && (
          <div className="space-y-8">
            <h2 className="font-serif text-xl font-bold border-b pb-2">Hero Section (Paling Atas)</h2>
            <div className="relative w-full aspect-[21/7] rounded-2xl border-2 border-dashed border-villa-200 overflow-hidden flex items-center justify-center group">
              <input type="file" accept="image/*" onChange={(e) => { setHeroFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setHeroImg(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <Image src={heroImg} alt="Hero" fill className="object-cover opacity-70 group-hover:opacity-40" />
              <div className="relative z-10 flex flex-col items-center bg-white/90 px-6 py-3 rounded-xl shadow-sm"><UploadCloud size={24} className="mb-1 text-villa-600"/>Ubah Foto Hero (Gunakan Foto Resolusi Tinggi)</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['id', 'en'].map(lang => (
                <div key={lang} className="space-y-4 p-6 bg-villa-50/50 rounded-2xl border border-villa-100">
                  <h3 className="font-bold text-villa-800 uppercase text-xs tracking-widest mb-4">Bahasa {lang === 'id' ? 'Indonesia' : 'Inggris'}</h3>
                  <div><label className="text-xs font-bold block mb-1">Eyebrow (Label Kecil)</label><input type="text" value={heroData[lang].eyebrow} onChange={(e)=>handleTextChange("hero", lang, "eyebrow", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Heading 1 (Baris 1)</label><input type="text" value={heroData[lang].heading1} onChange={(e)=>handleTextChange("hero", lang, "heading1", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Heading 2 (Baris 2 Hijau)</label><input type="text" value={heroData[lang].heading2} onChange={(e)=>handleTextChange("hero", lang, "heading2", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Heading 3 (Baris 3 Italic)</label><input type="text" value={heroData[lang].heading3} onChange={(e)=>handleTextChange("hero", lang, "heading3", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Deskripsi Singkat</label><textarea rows={3} value={heroData[lang].desc} onChange={(e)=>handleTextChange("hero", lang, "desc", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Teks Tombol 2 (Explore)</label><input type="text" value={heroData[lang].btn2} onChange={(e)=>handleTextChange("hero", lang, "btn2", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                </div>
              ))}
            </div>
            <button onClick={() => handleSave("hero")} disabled={isSaving} className="w-full py-4 bg-villa-900 text-white rounded-xl font-bold flex justify-center gap-2">{isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Simpan Perubahan Hero</>}</button>
          </div>
        )}

        {/* --- FORM ABOUT --- */}
        {activeTab === "about" && (
          <div className="space-y-8">
            <h2 className="font-serif text-xl font-bold border-b pb-2">About Section (Tentang Kami)</h2>
            <div className="relative w-full aspect-square md:aspect-[21/6] rounded-2xl border-2 border-dashed border-villa-200 overflow-hidden flex items-center justify-center group">
              <input type="file" accept="image/*" onChange={(e) => { setAboutFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setAboutImg(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <Image src={aboutImg} alt="About" fill className="object-cover opacity-70 group-hover:opacity-40" />
              <div className="relative z-10 flex flex-col items-center bg-white/90 px-6 py-3 rounded-xl shadow-sm"><UploadCloud size={24} className="mb-1 text-villa-600"/>Ubah Foto About</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['id', 'en'].map(lang => (
                <div key={lang} className="space-y-4 p-6 bg-villa-50/50 rounded-2xl border border-villa-100">
                  <h3 className="font-bold text-villa-800 uppercase text-xs tracking-widest mb-4">Bahasa {lang === 'id' ? 'Indonesia' : 'Inggris'}</h3>
                  <div><label className="text-xs font-bold block mb-1">Eyebrow</label><input type="text" value={aboutData[lang].eyebrow} onChange={(e)=>handleTextChange("about", lang, "eyebrow", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Judul Utama</label><input type="text" value={aboutData[lang].heading} onChange={(e)=>handleTextChange("about", lang, "heading", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Paragraf 1</label><textarea rows={3} value={aboutData[lang].paragraphs[0]} onChange={(e)=>handleArrayChange("about", lang, "paragraphs", 0, null, e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Paragraf 2</label><textarea rows={3} value={aboutData[lang].paragraphs[1]} onChange={(e)=>handleArrayChange("about", lang, "paragraphs", 1, null, e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Teks Tombol Lanjut</label><input type="text" value={aboutData[lang].button} onChange={(e)=>handleTextChange("about", lang, "button", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                </div>
              ))}
            </div>
            <button onClick={() => handleSave("about")} disabled={isSaving} className="w-full py-4 bg-villa-900 text-white rounded-xl font-bold flex justify-center gap-2">{isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Simpan Perubahan About</>}</button>
          </div>
        )}

        {/* --- FORM EXPERIENCE --- */}
        {activeTab === "experience" && (
          <div className="space-y-8">
            <h2 className="font-serif text-xl font-bold border-b pb-2">Experience Section (Pengalaman)</h2>
            <div className="relative w-full aspect-[16/9] md:aspect-[21/6] rounded-2xl border-2 border-dashed border-villa-200 overflow-hidden flex items-center justify-center group">
              <input type="file" accept="image/*" onChange={(e) => { setExpFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setExpImg(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <Image src={expImg} alt="Experience" fill className="object-cover opacity-70 group-hover:opacity-40" />
              <div className="relative z-10 flex flex-col items-center bg-white/90 px-6 py-3 rounded-xl shadow-sm"><UploadCloud size={24} className="mb-1 text-villa-600"/>Ubah Foto Pengalaman</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {['id', 'en'].map(lang => (
                <div key={lang} className="space-y-4 p-6 bg-villa-50/50 rounded-2xl border border-villa-100">
                  <h3 className="font-bold text-villa-800 uppercase text-xs tracking-widest mb-4">Bahasa {lang === 'id' ? 'Indonesia' : 'Inggris'}</h3>
                  <div><label className="text-xs font-bold block mb-1">Eyebrow</label><input type="text" value={expData[lang].eyebrow} onChange={(e)=>handleTextChange("experience", lang, "eyebrow", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Judul Utama</label><input type="text" value={expData[lang].heading} onChange={(e)=>handleTextChange("experience", lang, "heading", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  <div><label className="text-xs font-bold block mb-1">Deskripsi Utama</label><textarea rows={3} value={expData[lang].desc} onChange={(e)=>handleTextChange("experience", lang, "desc", e.target.value)} className="w-full text-sm p-3 rounded-xl border border-villa-200" /></div>
                  
                  {/* Features Array */}
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-villa-200 space-y-3">
                      <p className="text-xs font-bold text-villa-500">Poin Pengalaman {i+1}</p>
                      <input type="text" placeholder="Judul Poin" value={expData[lang].features[i]?.title || ""} onChange={(e)=>handleArrayChange("experience", lang, "features", i, "title", e.target.value)} className="w-full text-sm p-2 rounded-lg border border-villa-100 bg-gray-50" />
                      <textarea rows={2} placeholder="Deskripsi Poin" value={expData[lang].features[i]?.desc || ""} onChange={(e)=>handleArrayChange("experience", lang, "features", i, "desc", e.target.value)} className="w-full text-sm p-2 rounded-lg border border-villa-100 bg-gray-50" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <button onClick={() => handleSave("experience")} disabled={isSaving} className="w-full py-4 bg-villa-900 text-white rounded-xl font-bold flex justify-center gap-2">{isSaving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Simpan Perubahan Experience</>}</button>
          </div>
        )}

      </div>
    </div>
  );
}