"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Loader2, Trash2, UploadCloud, X, Maximize2, Image as ImageIcon, GripVertical, Save, ArrowDownUp } from "lucide-react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/lib/supabase";
import { GalleryImage } from "@/types/schema";

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Bulk Upload
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusText, setStatusText] = useState("");

  const [batchAltId, setBatchAltId] = useState("");
  const [batchAltEn, setBatchAltEn] = useState("");
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // State untuk Fitur Drag & Drop Reorder
  const [isReordering, setIsReordering] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  // FUNGSI FETCH YANG SUDAH KEBAL ERROR
  const fetchGallery = async () => {
    setLoading(true);
    
    // Percobaan 1: Mengambil data dengan urutan sort_order
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
      
    if (error) {
      console.warn("Kolom sort_order belum siap, menggunakan urutan default.");
      // Percobaan 2: Fallback jika kolom sort_order belum ada di database
      const { data: fallbackData } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (fallbackData) setImages(fallbackData as GalleryImage[]);
    } else if (data) {
      setImages(data as GalleryImage[]);
    }
    
    setLoading(false);
  };

  useEffect(() => { fetchGallery(); }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const rawFiles = Array.from(e.target.files);
    let processedFiles: File[] = [];

    setIsUploading(true);
    setStatusText("Menyiapkan dan memproses gambar...");

    for (let file of rawFiles) {
      try {
        let currentFile = file;
        const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic");

        if (isHeic) {
          setStatusText(`Mengonversi HEIC (${file.name})...`);
          const heicModule = await import("heic2any");
          const heic2anyFn = (heicModule as any).default || heicModule;
          const buffer = await file.arrayBuffer();
          const cleanBlob = new Blob([buffer], { type: file.type || 'image/heic' });
          
          try {
            const convertedBlob = await heic2anyFn({ blob: cleanBlob, toType: "image/jpeg", quality: 0.8, multiple: true });
            const blobToUse = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
            const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
            currentFile = new File([blobToUse], newFileName, { type: "image/jpeg" });
          } catch (heicError) {
            throw new Error("File HEIC tidak didukung.");
          }
        }

        setStatusText(`Mengoptimasi ukuran (${currentFile.name})...`);
        const options = { maxSizeMB: 1.5, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFile = await imageCompression(currentFile, options);
        processedFiles.push(compressedFile);
      } catch (err: any) {
        alert(`Gagal memproses file ${file.name}. \n\nAlasan: ${err.message}`);
      }
    }

    setUploadFiles((prev) => [...prev, ...processedFiles]);
    setIsUploading(false);
    setStatusText("");
    e.target.value = ''; 
  };

  const removeSelectedFile = (indexToRemove: number) => {
    setUploadFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) return;
    if (!batchAltId || !batchAltEn) return alert("Harap isi deskripsi gambar (Indonesia & Inggris) untuk SEO!");

    setIsUploading(true);
    setUploadProgress(0);

    try {
      let uploadedCount = 0;
      for (const file of uploadFiles) {
        setStatusText(`Mengunggah ${uploadedCount + 1} dari ${uploadFiles.length} foto...`);
        const fileName = `gallery/img-${Math.random().toString(36).substring(2, 15)}.jpg`;
        
        const { error: storageError } = await supabase.storage.from("omahku-media").upload(fileName, file);
        if (storageError) throw new Error(storageError.message);
        
        const { data: { publicUrl } } = supabase.storage.from("omahku-media").getPublicUrl(fileName);

        // Upload baru otomatis ditaruh di akhir urutan
        const newSortOrder = images.length + uploadedCount;

        await supabase.from("gallery_images").insert([{
          image_url: publicUrl,
          alt_text_id: batchAltId,
          alt_text_en: batchAltEn,
          sort_order: newSortOrder
        }]);

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / uploadFiles.length) * 100));
      }

      alert(`${uploadFiles.length} foto berhasil diunggah!`);
      setUploadFiles([]); setBatchAltId(""); setBatchAltEn(""); fetchGallery();
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setIsUploading(false); setUploadProgress(0); setStatusText("");
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    try {
      await supabase.from("gallery_images").delete().eq("id", id);
      if (imageUrl.includes("omahku-media")) {
        const path = imageUrl.split("/omahku-media/")[1];
        if (path) await supabase.storage.from("omahku-media").remove([path]);
      }
      fetchGallery();
    } catch (error) { alert("Gagal menghapus."); }
  };

  // --- FUNGSI SIMPAN URUTAN DRAG & DROP ---
  const handleSaveOrder = async () => {
    setIsSavingOrder(true);
    try {
      // Update semua urutan secara paralel ke Supabase
      const updatePromises = images.map((img, index) => 
        supabase.from("gallery_images").update({ sort_order: index }).eq("id", img.id)
      );
      
      const results = await Promise.all(updatePromises);
      
      // Cek apakah ada error (biasanya jika kolom sort_order belum ada)
      const hasError = results.some(res => res.error);
      if (hasError) {
         alert("Gagal menyimpan. Pastikan Anda sudah menambahkan kolom 'sort_order' (Tipe: int4) di tabel gallery_images Supabase.");
      } else {
         alert("Urutan galeri berhasil diperbarui!");
         setIsReordering(false);
         fetchGallery();
      }
    } catch (error) {
      alert("Gagal menyimpan urutan.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const heightClasses = ["h-64", "h-96", "h-72", "h-[26rem]", "h-80", "h-[20rem]"];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      {/* AREA UPLOAD (Disembunyikan saat mode reorder aktif agar admin fokus) */}
      {!isReordering && (
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="bg-white p-6 md:p-8 rounded-3xl border border-villa-100 shadow-sm">
          <div className="mb-8 border-b border-villa-50 pb-6">
            <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Galeri Foto</h1>
            <p className="text-charcoal/60 font-medium">Mendukung format <span className="text-villa-600 font-bold">HEIC, PNG, JPG</span>. Auto-Convert & Auto-Compression.</p>
          </div>

          <div className="space-y-6">
            <div className="relative w-full rounded-3xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 hover:bg-emerald-100/50 transition-colors flex items-center justify-center min-h-[140px] group cursor-pointer">
              <input type="file" multiple accept="image/png, image/jpeg, image/jpg, image/heic, image/heif" onChange={handleFileSelect} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
              <div className="flex flex-col items-center text-emerald-800 text-center p-6 pointer-events-none">
                {isUploading ? (
                  <><Loader2 size={36} className="mb-3 text-emerald-600 animate-spin" /><span className="text-base font-bold text-emerald-800">{statusText || "Memproses file..."}</span></>
                ) : (
                  <><UploadCloud size={36} className="mb-3 text-emerald-500 group-hover:scale-110 transition-transform" /><span className="text-base font-bold">Pilih Foto atau Seret ke Sini</span></>
                )}
              </div>
            </div>

            <AnimatePresence>
              {uploadFiles.length > 0 && !isUploading && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="bg-villa-50 border border-villa-100 p-5 md:p-7 rounded-2xl overflow-hidden">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-villa-900 flex items-center gap-2"><ImageIcon size={16} className="text-villa-600"/> {uploadFiles.length} Foto Siap Diunggah</h3>
                    <button type="button" onClick={() => setUploadFiles([])} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">Hapus Antrean</button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-8">
                    {uploadFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-emerald-400 opacity-90 group shadow-sm bg-white">
                        <Image src={URL.createObjectURL(file)} alt="Preview" fill className="object-cover" />
                        <button type="button" onClick={() => removeSelectedFile(idx)} className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"><X size={14}/></button>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleBulkUpload} className="space-y-5 border-t border-villa-200/60 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-bold text-villa-900 mb-2">Deskripsi Batch (ID)</label>
                        <input type="text" required value={batchAltId} onChange={(e) => setBatchAltId(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-villa-900 mb-2">Batch Description (EN)</label>
                        <input type="text" required value={batchAltEn} onChange={(e) => setBatchAltEn(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-villa-500 outline-none" />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button type="submit" className="w-full md:w-auto py-3.5 px-8 bg-villa-900 hover:bg-villa-800 text-white rounded-xl font-bold flex items-center gap-2 transition-all"><UploadCloud size={18}/> Unggah & Simpan</button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {isUploading && uploadProgress > 0 && (
              <div className="bg-villa-50 border border-villa-100 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs font-bold text-villa-900"><span>{statusText}</span><span>{uploadProgress}%</span></div>
                <div className="w-full h-3 bg-white rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div></div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* GALLERY AREA & DRAG-AND-DROP REORDER */}
      <div className="space-y-6">
        
        {/* Header Galeri & Tombol Reorder */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2">
          <h2 className="text-xl font-serif font-bold text-villa-900 flex items-center gap-2">
            <ImageIcon className="text-villa-500"/> {isReordering ? "Atur Urutan Tampil" : "Daftar Galeri Tersimpan"}
          </h2>
          
          {images.length > 1 && (
            <button 
              onClick={() => setIsReordering(!isReordering)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${isReordering ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-white border border-villa-200 text-villa-900 hover:bg-villa-50'}`}
            >
              {isReordering ? <><X size={16}/> Batal Atur</> : <><ArrowDownUp size={16}/> Ubah Urutan</>}
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-villa-400" /></div>
        ) : images.length === 0 ? (
           <div className="bg-white p-12 rounded-3xl border border-villa-100 flex flex-col items-center text-center shadow-sm"><ImageIcon size={48} className="text-villa-200 mb-4" /><h3 className="text-xl font-bold text-villa-900 mb-2">Galeri Masih Kosong</h3></div>
        ) : isReordering ? (
          
          /* MODE DRAG AND DROP (REORDER) */
          <div className="bg-white p-6 rounded-3xl border border-villa-200 shadow-xl">
            <div className="flex justify-between items-center mb-6 bg-villa-50 p-4 rounded-xl">
              <p className="text-sm text-villa-800">Tahan dan geser (<GripVertical className="inline w-4 h-4"/>) foto ke atas/bawah untuk mengubah urutan tampil di Homepage.</p>
              <button onClick={handleSaveOrder} disabled={isSavingOrder} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 shadow-md">
                {isSavingOrder ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>} 
                {isSavingOrder ? "Menyimpan..." : "Simpan Urutan"}
              </button>
            </div>

            <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {images.map((image) => (
                <Reorder.Item 
                  key={image.id} 
                  value={image} 
                  className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-xl cursor-grab active:cursor-grabbing shadow-sm hover:border-emerald-300 transition-colors"
                >
                  <div className="cursor-grab text-gray-400 hover:text-emerald-500"><GripVertical /></div>
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                    <Image src={image.image_url} alt="thumb" fill className="object-cover" />
                  </div>
                  <p className="text-sm font-medium text-villa-900 line-clamp-1 flex-1">{image.alt_text_id}</p>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

        ) : (
          /* MODE NORMAL (MASONRY) */
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 lg:gap-6 space-y-4 lg:space-y-6">
            {images.map((image, index) => (
              <motion.div key={image.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={`relative w-full ${heightClasses[index % heightClasses.length]} rounded-3xl overflow-hidden group break-inside-avoid shadow-sm hover:shadow-xl transition-all duration-500 cursor-zoom-in`}>
                <Image src={image.image_url} alt={image.alt_text_id} fill className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-villa-950/0 group-hover:bg-villa-950/50 transition-colors duration-300 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                  <button onClick={() => setSelectedImage(image.image_url)} className="p-3 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white hover:text-villa-900 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 mb-3 shadow-lg"><Maximize2 size={24} /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(image.id, image.image_url); }} className="flex items-center gap-2 px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full text-xs font-bold hover:bg-red-600 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"><Trash2 size={14} /> Hapus</button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)} className="fixed inset-0 z-[100] flex items-center justify-center bg-villa-950/90 backdrop-blur-md p-4 sm:p-10 cursor-zoom-out">
            <button onClick={() => setSelectedImage(null)} className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors z-50"><X size={24} /></button>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="relative w-full max-w-5xl h-[80vh] rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <Image src={selectedImage} alt="Enlarged" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}