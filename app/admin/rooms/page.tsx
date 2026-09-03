"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Plus, Edit, Trash2, UploadCloud, X, Image as ImageIcon, View, Save, FolderOpen } from "lucide-react";
import { supabase } from "@/lib/supabase";

const emptyForm = {
  name_id: "", name_en: "",
  description_id: "", description_en: "",
  capacity_id: "", capacity_en: "", 
  bed_detail_id: "", bed_detail_en: "", 
  view_detail_id: "", view_detail_en: "",
  image_url: "", image_360_url: "",
  category: "bedroom",
  gallery_urls: [] as string[]
};

export default function AdminRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [panoFile, setPanoFile] = useState<File | null>(null);

  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"thumbnail" | "panorama" | "room_gallery" | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: roomsData } = await supabase.from("villa_rooms").select("*").order("created_at", { ascending: true });
    if (roomsData) setRooms(roomsData);
    
    const { data: galleryData } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
    if (galleryData) setGalleryImages(galleryData);
    
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddNew = () => {
    setForm(emptyForm);
    setThumbFile(null); setPanoFile(null);
    setIsEditing(false); setEditId(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: any) => {
    setForm({
      name_id: room.name_id, name_en: room.name_en,
      description_id: room.description_id, description_en: room.description_en,
      capacity_id: room.capacity_id || room.capacity || "", capacity_en: room.capacity_en || "",
      bed_detail_id: room.bed_detail_id || room.bed_detail || "", bed_detail_en: room.bed_detail_en || "",
      view_detail_id: room.view_detail_id || room.view_detail || "", view_detail_en: room.view_detail_en || "",
      image_url: room.image_url, image_360_url: room.image_360_url || "",
      category: room.category || "bedroom",
      gallery_urls: room.gallery_urls || []
    });
    setThumbFile(null); setPanoFile(null);
    setIsEditing(true); setEditId(room.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus ruangan ini?")) return;
    try {
      await supabase.from("villa_rooms").delete().eq("id", id);
      fetchData();
    } catch (error) { alert("Gagal menghapus ruangan."); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url && !thumbFile) return alert("Foto Utama (Thumbnail) wajib diisi!");
    
    setIsSaving(true);
    try {
      let finalThumbUrl = form.image_url;
      let finalPanoUrl = form.image_360_url;

      if (thumbFile) {
        const ext = thumbFile.name.split('.').pop();
        const fileName = `rooms/thumb-${Math.random().toString(36).substring(2, 10)}.${ext}`;
        await supabase.storage.from("omahku-media").upload(fileName, thumbFile);
        const { data } = supabase.storage.from("omahku-media").getPublicUrl(fileName);
        finalThumbUrl = data.publicUrl;
      }

      if (panoFile) {
        const ext = panoFile.name.split('.').pop();
        const fileName = `rooms/pano-${Math.random().toString(36).substring(2, 10)}.${ext}`;
        await supabase.storage.from("omahku-media").upload(fileName, panoFile);
        const { data } = supabase.storage.from("omahku-media").getPublicUrl(fileName);
        finalPanoUrl = data.publicUrl;
      }

      const payload = {
        name_id: form.name_id, name_en: form.name_en,
        description_id: form.description_id, description_en: form.description_en,
        capacity_id: form.capacity_id, capacity_en: form.capacity_en,
        bed_detail_id: form.bed_detail_id, bed_detail_en: form.bed_detail_en,
        view_detail_id: form.view_detail_id, view_detail_en: form.view_detail_en,
        image_url: finalThumbUrl, image_360_url: finalPanoUrl || null,
        category: form.category,
        gallery_urls: form.gallery_urls
      };

      if (isEditing && editId) {
        await supabase.from("villa_rooms").update(payload).eq("id", editId);
      } else {
        await supabase.from("villa_rooms").insert([payload]);
      }

      setIsFormOpen(false); fetchData();
      alert("Data berhasil disimpan!");
    } catch (error: any) { alert("Error: " + error.message); } 
    finally { setIsSaving(false); }
  };

  const thumbPreview = thumbFile ? URL.createObjectURL(thumbFile) : form.image_url;
  const panoPreview = panoFile ? URL.createObjectURL(panoFile) : form.image_360_url;
  const isFacility = form.category === 'facility';

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-villa-100 pb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Kelola Ruangan & Fasilitas</h1>
          <p className="text-charcoal/60 font-medium">Atur Kamar Tidur dan Fasilitas Umum (Kolam, Lounge, dll).</p>
        </div>
        {!isFormOpen && (
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-villa-900 hover:bg-villa-800 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md">
            <Plus size={18} /> Tambah Baru
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isFormOpen ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-3xl border border-villa-100 shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-villa-50 bg-villa-50/50">
              <h2 className="text-xl font-serif font-bold text-villa-900">{isEditing ? "Edit Item" : "Item Baru"}</h2>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-white rounded-full text-charcoal/50 hover:text-red-500 transition-colors shadow-sm"><X size={20}/></button>
            </div>

            <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8">
              
              <div className="flex gap-6 mb-4">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={form.category === 'bedroom'} onChange={() => setForm({...form, category: 'bedroom'})} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-bold text-villa-900">Kamar Tidur (Bedroom)</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={form.category === 'facility'} onChange={() => setForm({...form, category: 'facility'})} className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-bold text-villa-900">Fasilitas Umum (Facility)</span>
                 </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-villa-900 mb-3">Foto Utama (Thumbnail)</label>
                  <div className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center overflow-hidden group">
                    {thumbPreview ? (
                      <>
                        <Image src={thumbPreview} alt="Thumbnail Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"><button type="button" onClick={() => { setThumbFile(null); setForm({...form, image_url: ""}); }} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">Hapus</button></div>
                      </>
                    ) : (
                      <><input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setThumbFile(e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" /><UploadCloud size={32} className="text-emerald-400 mb-2" /><span className="text-sm font-bold text-emerald-800">Upload Thumbnail</span></>
                    )}
                  </div>
                  {!thumbPreview && <button type="button" onClick={() => { setMediaTarget("thumbnail"); setIsMediaPickerOpen(true); }} className="mt-3 w-full flex justify-center gap-2 py-2.5 border border-villa-200 bg-white hover:bg-villa-50 rounded-xl text-sm font-bold shadow-sm"><FolderOpen size={16} /> Bank Foto</button>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-villa-900 mb-3 flex items-center gap-2">Foto Panorama 360° <span className="text-xs font-normal text-charcoal/50">(Opsional)</span></label>
                  <div className="relative w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 hover:bg-purple-50 transition-colors flex flex-col items-center justify-center overflow-hidden group">
                    {panoPreview ? (
                      <>
                        <Image src={panoPreview} alt="Panorama Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3"><button type="button" onClick={() => { setPanoFile(null); setForm({...form, image_360_url: ""}); }} className="px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600">Hapus</button></div>
                      </>
                    ) : (
                      <><input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setPanoFile(e.target.files[0]) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" /><View size={32} className="text-purple-400 mb-2" /><span className="text-sm font-bold text-purple-800">Upload Panorama</span></>
                    )}
                  </div>
                  {!panoPreview && <button type="button" onClick={() => { setMediaTarget("panorama"); setIsMediaPickerOpen(true); }} className="mt-3 w-full flex justify-center gap-2 py-2.5 border border-purple-200 bg-white hover:bg-purple-50 rounded-xl text-sm font-bold shadow-sm"><FolderOpen size={16} /> Bank Foto</button>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-villa-100">
                <div className="space-y-4">
                  <h3 className="font-bold text-villa-900 border-b border-villa-50 pb-2">Detail (Indonesia)</h3>
                  <div><label className="block text-xs font-bold text-charcoal/70 mb-1">Nama {isFacility ? 'Fasilitas' : 'Ruangan'}</label><input type="text" required value={form.name_id} onChange={(e) => setForm({...form, name_id: e.target.value})} className="w-full bg-villa-50 border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="block text-xs font-bold text-charcoal/70 mb-1">Deskripsi Singkat</label><textarea required rows={3} value={form.description_id} onChange={(e) => setForm({...form, description_id: e.target.value})} className="w-full bg-villa-50 border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-villa-900 border-b border-villa-50 pb-2">Detail (English)</h3>
                  <div><label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? 'Facility' : 'Room'} Name</label><input type="text" required value={form.name_en} onChange={(e) => setForm({...form, name_en: e.target.value})} className="w-full bg-villa-50 border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                  <div><label className="block text-xs font-bold text-charcoal/70 mb-1">Short Description</label><textarea required rows={3} value={form.description_en} onChange={(e) => setForm({...form, description_en: e.target.value})} className="w-full bg-villa-50 border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" /></div>
                </div>
              </div>

              {/* INPUT SPESIFIKASI DINAMIS (ID & EN) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-villa-100">
                
                {/* Kolom Indonesia */}
                <div className="space-y-4">
                  <h3 className="font-bold text-villa-900 border-b border-villa-50 pb-2">Spesifikasi (Indonesia)</h3>
                  <div>
                    <label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? "Kapasitas / Fungsi" : "Kapasitas"}</label>
                    <input type="text" required value={form.capacity_id} onChange={(e) => setForm({...form, capacity_id: e.target.value})} placeholder={isFacility ? "Contoh: Area Publik / 10 Org" : "Contoh: 2-4 Orang"} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? "Kelengkapan / Fasilitas" : "Tipe Kasur"}</label>
                    <input type="text" required value={form.bed_detail_id} onChange={(e) => setForm({...form, bed_detail_id: e.target.value})} placeholder={isFacility ? "Contoh: Smart TV, Sofa" : "Contoh: 1 King Bed"} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? "Lokasi / Pemandangan" : "Pemandangan (View)"}</label>
                    <input type="text" required value={form.view_detail_id} onChange={(e) => setForm({...form, view_detail_id: e.target.value})} placeholder={isFacility ? "Contoh: Lantai 2 / Kebun" : "Contoh: Menghadap Kebun"} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                  </div>
                </div>

                {/* Kolom English */}
                <div className="space-y-4">
                  <h3 className="font-bold text-villa-900 border-b border-villa-50 pb-2">Specifications (English)</h3>
                  <div>
                    <label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? "Capacity / Function" : "Capacity"}</label>
                    <input type="text" required value={form.capacity_en} onChange={(e) => setForm({...form, capacity_en: e.target.value})} placeholder={isFacility ? "Example: Public Area / 10 Pax" : "Example: 2-4 Pax"} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? "Amenities / Facilities" : "Bed Type"}</label>
                    <input type="text" required value={form.bed_detail_en} onChange={(e) => setForm({...form, bed_detail_en: e.target.value})} placeholder={isFacility ? "Example: Smart TV, Sofa" : "Example: 1 King Bed"} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-charcoal/70 mb-1">{isFacility ? "Location / View" : "View"}</label>
                    <input type="text" required value={form.view_detail_en} onChange={(e) => setForm({...form, view_detail_en: e.target.value})} placeholder={isFacility ? "Example: 2nd Floor / Garden" : "Example: Garden View"} className="w-full bg-white border border-villa-200 rounded-xl px-4 py-2.5 text-sm outline-none" />
                  </div>
                </div>

              </div>

              <div className="pt-6 border-t border-villa-100">
                <h3 className="font-bold text-villa-900 mb-2">Galeri Tambahan (Muncul di Bawah Keterangan)</h3>
                <p className="text-xs text-charcoal/60 mb-4">Tambahkan foto-foto detail (opsional).</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
                  {form.gallery_urls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-villa-200">
                      <Image src={url} alt="Gallery" fill className="object-cover" />
                      <button type="button" onClick={() => {
                        const newArr = [...form.gallery_urls];
                        newArr.splice(idx, 1);
                        setForm({...form, gallery_urls: newArr});
                      }} className="absolute top-1 right-1 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded-lg shadow"><X size={14}/></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => { setMediaTarget("room_gallery"); setIsMediaPickerOpen(true); }} className="relative aspect-square rounded-xl border-2 border-dashed border-emerald-300 flex flex-col items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors">
                    <Plus size={24} />
                    <span className="text-[10px] font-bold mt-1 text-center">Tambah Foto<br/>Bank Galeri</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-villa-100">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-3 font-bold text-charcoal hover:text-red-500 transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md disabled:opacity-50">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} {isSaving ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-40"><Loader2 size={40} className="animate-spin text-villa-300" /></div>
            ) : rooms.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-villa-100 text-center"><p className="text-charcoal/50">Belum ada item yang ditambahkan.</p></div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rooms.map((room) => (
                  <div key={room.id} className="flex bg-white rounded-2xl overflow-hidden border border-villa-100 shadow-sm">
                    <div className="relative w-40 sm:w-48 shrink-0 bg-villa-50">
                      <Image src={room.image_url} alt={room.name_id} fill className="object-cover" />
                      <div className="absolute bottom-2 left-2 bg-white/90 text-villa-900 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">{room.category === 'facility' ? 'Fasilitas' : 'Kamar'}</div>
                    </div>
                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-serif font-bold text-lg text-villa-900 line-clamp-1">{room.name_id}</h3>
                        <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">{room.description_id}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-4 justify-end">
                        <button onClick={() => handleEdit(room)} className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors"><Edit size={14}/> Edit</button>
                        <button onClick={() => handleDelete(room.id)} className="flex items-center gap-1.5 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"><Trash2 size={14}/> Hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMediaPickerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-villa-950/80 backdrop-blur-sm p-4 sm:p-10">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-villa-100 bg-villa-50">
                <div>
                  <h3 className="font-serif font-bold text-xl text-villa-900 flex items-center gap-2"><FolderOpen className="text-emerald-500" /> Bank Foto Galeri</h3>
                  <p className="text-xs text-charcoal/60 mt-1">Pilih gambar untuk dimasukkan ke data.</p>
                </div>
                <button onClick={() => setIsMediaPickerOpen(false)} className="p-2 hover:bg-red-50 text-charcoal hover:text-red-500 rounded-full transition-colors"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar">
                {galleryImages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-charcoal/40"><ImageIcon size={48} className="mb-3 opacity-20" /><p className="font-medium text-sm">Belum ada foto di Galeri.</p></div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryImages.map((img) => (
                      <div 
                        key={img.id}
                        onClick={() => {
                          if (mediaTarget === "thumbnail") { setForm({ ...form, image_url: img.image_url }); setThumbFile(null); }
                          else if (mediaTarget === "panorama") { setForm({ ...form, image_360_url: img.image_url }); setPanoFile(null); }
                          else if (mediaTarget === "room_gallery") { setForm({ ...form, gallery_urls: [...form.gallery_urls, img.image_url] }); }
                          setIsMediaPickerOpen(false);
                        }}
                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-emerald-500 shadow-sm hover:shadow-lg transition-all"
                      >
                        <Image src={img.image_url} alt={img.alt_text_id || "Galeri"} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/40 transition-colors flex items-center justify-center">
                          <span className="opacity-0 group-hover:opacity-100 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-all shadow-md">Pilih Foto</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}