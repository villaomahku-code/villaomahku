"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, UploadCloud, FileText, Image as ImageIcon, Sparkles, Edit3, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Article } from "@/types/schema";

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk form artikel
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Data Form
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentId, setContentId] = useState("");
  const [contentEn, setContentEn] = useState("");

  // State untuk AI
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setArticles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const generateSlug = (text: string) => {
    return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
  };

  // --- FUNGSI MENGGUNAKAN AI ---
  const handleGenerateAI = async () => {
    if (!aiPrompt) return alert("Ketik topik artikelnya terlebih dahulu!");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) throw new Error("Gagal mengambil respon AI");

      const data = await res.json();
      
      // Otomatis mengisi form dengan hasil AI
      setTitleId(data.titleId);
      setTitleEn(data.titleEn);
      setContentId(data.contentId);
      setContentEn(data.contentEn);
      
      // Generate AI Image on the fly (Menggunakan layanan gratis Pollinations)
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${data.imageKeyword}%20villa%20aesthetic?width=1600&height=900&nologo=true`;
      setPreviewUrl(generatedImageUrl);
      setFile(null); // Kosongkan file karena kita pakai link dari AI

      setShowAiBox(false);
      setAiPrompt("");
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memanggil AI. Pastikan API Key benar.");
    } finally {
      setIsGenerating(false);
    }
  };

  // --- FUNGSI KLIK TOMBOL EDIT ---
  const handleEdit = (article: Article) => {
    setEditId(article.id);
    setTitleId(article.title_id);
    setTitleEn(article.title_en);
    setContentId(article.content_id);
    setContentEn(article.content_en);
    setPreviewUrl(article.image_url);
    setFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setFile(null);
    setPreviewUrl(null);
    setTitleId("");
    setTitleEn("");
    setContentId("");
    setContentEn("");
    setShowForm(false);
  };

  // --- FUNGSI SIMPAN (CREATE & UPDATE) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !previewUrl) return alert("Pilih gambar cover terlebih dahulu!");
    if (!titleId || !titleEn || !contentId || !contentEn) return alert("Lengkapi semua form teks!");

    setIsSaving(true);
    try {
      let finalImageUrl = previewUrl;

      // Jika user mengunggah file baru dari laptop, upload ke Supabase Storage
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `article-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `articles/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("omahku-media").upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("omahku-media").getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      const slug = generateSlug(titleId);
      const articleData = {
        title_id: titleId,
        title_en: titleEn,
        slug: slug,
        content_id: contentId,
        content_en: contentEn,
        image_url: finalImageUrl as string,
      };

      if (editId) {
        // UPDATE ARTIKEL LAMA
        const { error: dbError } = await supabase.from("articles").update(articleData).eq("id", editId);
        if (dbError) throw dbError;
        alert("Artikel berhasil diperbarui!");
      } else {
        // INSERT ARTIKEL BARU
        const { error: dbError } = await supabase.from("articles").insert([articleData]);
        if (dbError) throw dbError;
        alert("Artikel berhasil diterbitkan!");
      }

      resetForm();
      fetchArticles();
    } catch (error: any) {
      console.error("Save error:", error);
      alert("Gagal menyimpan artikel: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Peringatan: Artikel ini akan dihapus permanen. Lanjutkan?")) return;
    try {
      await supabase.from("articles").delete().eq("id", id);
      
      // Jika gambarnya dari storage kita (bukan dari AI image URL luar), hapus fisiknya
      if (imageUrl.includes("omahku-media")) {
        const path = imageUrl.split("/omahku-media/")[1];
        if (path) await supabase.storage.from("omahku-media").remove([path]);
      }
      fetchArticles();
    } catch (error) {
      alert("Gagal menghapus artikel.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Kelola Artikel</h1>
          <p className="text-charcoal/60 font-medium">Buat pengumuman, promo, atau berita terbaru.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-villa-600 hover:bg-villa-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <Plus size={18} /> Tulis Artikel Baru
          </button>
        )}
      </div>

      {/* Form Tambah/Edit Artikel */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-3xl border border-villa-100 shadow-sm mb-10">
          
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-villa-100">
            <h2 className="font-serif text-xl font-bold text-villa-900">
              {editId ? "Edit Artikel" : "Artikel Baru"}
            </h2>
            <div className="flex gap-3">
              <button onClick={() => setShowAiBox(!showAiBox)} className="flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors">
                <Sparkles size={16} /> Buat dengan AI
              </button>
              <button onClick={resetForm} className="p-2 text-charcoal hover:bg-villa-50 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Kotak AI Generator */}
          {showAiBox && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mb-8 p-6 bg-purple-900 rounded-2xl text-white shadow-inner">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Sparkles size={18} className="text-purple-300"/> Asisten Penulis AI</h3>
              <p className="text-sm text-purple-200 mb-4">Tuliskan 1 kalimat saja (misal: "Promo tahun baru diskon 30%"), AI akan menuliskan versi lengkap ID & EN sekaligus mencarikan gambarnya!</p>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ketik topik artikel di sini..." 
                  className="flex-1 bg-purple-950/50 border border-purple-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400"
                />
                <button onClick={handleGenerateAI} disabled={isGenerating} className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2">
                  {isGenerating ? <><Loader2 size={16} className="animate-spin" /> Sedang Menulis...</> : "Generate"}
                </button>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Upload/Preview Gambar Cover */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-villa-900 mb-2">Gambar Cover Utama</label>
              <div className="relative w-full aspect-[21/9] md:aspect-[21/6] rounded-2xl border-2 border-dashed border-villa-200 bg-villa-50 hover:bg-villa-100/50 transition-colors overflow-hidden flex items-center justify-center group">
                <input
                  type="file" accept="image/*"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    if(e.target.files?.[0]) setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {previewUrl ? (
                  <>
                    <Image src={previewUrl} alt="Preview" fill className="object-cover z-0 opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 flex flex-col items-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                      <ImageIcon size={24} className="text-villa-600 mb-1" />
                      <span className="font-bold text-sm text-villa-900">Klik untuk mengganti gambar</span>
                      {file && <span className="text-xs text-villa-600 mt-1">{file.name}</span>}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-charcoal/50">
                    <UploadCloud size={40} className="mb-2 text-villa-400" />
                    <span className="font-medium text-sm">Pilih gambar lanskap (16:9)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Input Judul */}
            <div>
              <label className="block text-sm font-bold text-villa-900 mb-2">Judul (Indonesia)</label>
              <input type="text" value={titleId} onChange={(e) => setTitleId(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-villa-500 font-sans text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-villa-900 mb-2">Title (English)</label>
              <input type="text" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-villa-500 font-sans text-sm" required />
            </div>

            {/* Input Konten */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-villa-900 mb-2">Isi Artikel (Indonesia)</label>
              <textarea rows={6} value={contentId} onChange={(e) => setContentId(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-villa-500 font-sans text-sm" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-villa-900 mb-2">Article Content (English)</label>
              <textarea rows={6} value={contentEn} onChange={(e) => setContentEn(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 focus:ring-1 focus:ring-villa-500 font-sans text-sm" required />
            </div>

            {/* Tombol Simpan */}
            <div className="md:col-span-2 flex justify-end mt-2 border-t border-villa-100 pt-6 gap-3">
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-villa-50 transition-colors">Batal</button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-villa-900 hover:bg-villa-800 text-white px-8 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50">
                {isSaving ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : (editId ? "Simpan Perubahan" : "Terbitkan Artikel")}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List/Daftar Artikel */}
      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-villa-300" /></div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-villa-100 p-16 text-center">
          <FileText size={48} className="mx-auto text-villa-200 mb-4" />
          <h3 className="font-serif text-xl font-bold text-villa-900 mb-2">Belum ada artikel</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const dateStr = new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            return (
              <motion.div key={article.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-villa-100 hover:shadow-md transition-shadow">
                <div className="relative aspect-[16/9] w-full bg-villa-100">
                  <Image src={article.image_url} alt={article.title_id} fill className="object-cover" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <span className="text-[10px] uppercase font-bold text-villa-500 mb-2 tracking-wider">{dateStr}</span>
                  <h3 className="font-serif text-lg font-bold text-villa-900 mb-3 line-clamp-2">{article.title_id}</h3>
                  <p className="font-sans text-sm text-charcoal/70 line-clamp-3 mb-6 flex-1">{article.content_id}</p>
                  
                  <div className="pt-4 border-t border-villa-100 flex justify-between items-center">
                    <button onClick={() => handleEdit(article)} className="flex items-center gap-1.5 text-xs font-bold text-villa-600 hover:text-villa-900 transition-colors">
                      <Edit3 size={14} /> Edit Artikel
                    </button>
                    <button onClick={() => handleDelete(article.id, article.image_url)} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}