"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, UploadCloud, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { GalleryImage } from "@/types/schema";

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk form upload
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [altId, setAltId] = useState("");
  const [altEn, setAltEn] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Mengambil data galeri dari database
  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching images:", error);
    } else {
      setImages(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Fungsi Upload Gambar
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Pilih file gambar terlebih dahulu!");
    if (!altId || !altEn) return alert("Isi deskripsi gambar (ID & EN)!");

    setIsUploading(true);

    try {
      // 1. Buat nama file unik
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      // 2. Upload file ke Supabase Storage (bucket: omahku-media)
      const { error: uploadError } = await supabase.storage
        .from("omahku-media")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Dapatkan URL publik gambar tersebut
      const { data: { publicUrl } } = supabase.storage
        .from("omahku-media")
        .getPublicUrl(filePath);

      // 4. Simpan data ke Database (tabel: gallery_images)
      const { error: dbError } = await supabase
        .from("gallery_images")
        .insert([
          {
            image_url: publicUrl,
            alt_text_id: altId,
            alt_text_en: altEn,
          }
        ]);

      if (dbError) throw dbError;

      // Reset form dan refresh data
      setFile(null);
      setAltId("");
      setAltEn("");
      setShowForm(false);
      fetchImages();
      alert("Gambar berhasil diunggah!");

    } catch (error: any) {
      console.error("Upload error:", error);
      alert("Gagal mengunggah gambar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Fungsi Hapus Gambar
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus gambar ini?")) return;

    try {
      // 1. Hapus dari Database
      const { error: dbError } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // 2. Ekstrak path storage dari URL dan hapus file fisiknya (Opsional tapi disarankan)
      const path = imageUrl.split("/omahku-media/")[1];
      if (path) {
        await supabase.storage.from("omahku-media").remove([path]);
      }

      fetchImages();
    } catch (error: any) {
      console.error("Delete error:", error);
      alert("Gagal menghapus gambar.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Kelola Galeri</h1>
          <p className="text-charcoal/60 font-medium">Tambah atau hapus foto galeri website.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-villa-600 hover:bg-villa-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
        >
          {showForm ? "Tutup Form" : <><Plus size={18} /> Tambah Foto</>}
        </button>
      </div>

      {/* Form Tambah Foto */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 md:p-8 rounded-3xl border border-villa-100 shadow-sm mb-10"
        >
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Area Input File */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-villa-900 mb-2">Pilih Foto</label>
              <div className="border-2 border-dashed border-villa-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-villa-50 hover:bg-villa-100/50 transition-colors cursor-pointer relative overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
                {file ? (
                  <div className="flex flex-col items-center text-villa-600">
                    <ImageIcon size={40} className="mb-2" />
                    <span className="font-medium text-sm text-center">{file.name}</span>
                    <span className="text-xs mt-1 text-charcoal/50">Klik untuk mengganti</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-charcoal/50">
                    <UploadCloud size={40} className="mb-2 text-villa-400" />
                    <span className="font-medium text-sm">Klik atau seret foto ke sini</span>
                    <span className="text-xs mt-1">Maksimal 5MB (JPG/PNG)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Area Input Alt Text */}
            <div>
              <label className="block text-sm font-bold text-villa-900 mb-2">Deskripsi (Indonesia)</label>
              <input
                type="text"
                value={altId}
                onChange={(e) => setAltId(e.target.value)}
                placeholder="Contoh: Tampak depan villa saat pagi hari"
                className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-villa-900 focus:outline-none focus:border-villa-500 focus:ring-1 focus:ring-villa-500 transition-all font-sans text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-villa-900 mb-2">Deskripsi (Inggris)</label>
              <input
                type="text"
                value={altEn}
                onChange={(e) => setAltEn(e.target.value)}
                placeholder="Example: Front view of the villa in the morning"
                className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-villa-900 focus:outline-none focus:border-villa-500 focus:ring-1 focus:ring-villa-500 transition-all font-sans text-sm"
                required
              />
            </div>

            <div className="md:col-span-2 flex justify-end mt-2">
              <button
                type="submit"
                disabled={isUploading || !file}
                className="flex items-center gap-2 bg-villa-900 hover:bg-villa-800 text-white px-8 py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
              >
                {isUploading ? <><Loader2 size={18} className="animate-spin" /> Mengunggah...</> : "Unggah & Simpan"}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Grid Galeri */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 size={40} className="animate-spin text-villa-300" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-3xl border border-villa-100 p-16 text-center">
          <ImageIcon size={48} className="mx-auto text-villa-200 mb-4" />
          <h3 className="font-serif text-xl font-bold text-villa-900 mb-2">Belum ada foto</h3>
          <p className="text-charcoal/60 text-sm">Silakan klik "Tambah Foto" untuk mulai mengisi galeri.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <motion.div 
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-villa-100 shadow-sm border border-villa-100"
            >
              <Image
                src={img.image_url}
                alt={img.alt_text_id}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay Hover */}
              <div className="absolute inset-0 bg-villa-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => handleDelete(img.id, img.image_url)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                    title="Hapus Foto"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-white text-xs font-medium line-clamp-2 drop-shadow-md">
                    {img.alt_text_id}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}