"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, Plus, Trash2, UploadCloud, Edit3, X, BedDouble } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { VillaRoom } from "@/types/schema";

export default function AdminRooms() {
  const [rooms, setRooms] = useState<VillaRoom[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [nameId, setNameId] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [capacity, setCapacity] = useState("");
  const [bedDetail, setBedDetail] = useState("");
  const [viewDetail, setViewDetail] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");

  const fetchRooms = async () => {
    setLoading(true);
    const { data } = await supabase.from("villa_rooms").select("*").order("created_at", { ascending: true });
    if (data) setRooms(data);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, []);

  const resetForm = () => {
    setEditId(null); setFile(null); setPreviewUrl(null);
    setNameId(""); setNameEn(""); setCapacity(""); setBedDetail(""); setViewDetail(""); setDescId(""); setDescEn("");
    setShowForm(false);
  };

  const handleEdit = (room: VillaRoom) => {
    setEditId(room.id);
    setNameId(room.name_id); setNameEn(room.name_en);
    setCapacity(room.capacity); setBedDetail(room.bed_detail); setViewDetail(room.view_detail);
    setDescId(room.description_id); setDescEn(room.description_en);
    setPreviewUrl(room.image_url);
    setFile(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !previewUrl) return alert("Pilih foto ruangan terlebih dahulu!");
    setIsSaving(true);

    try {
      let finalImageUrl = previewUrl;

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `room-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `rooms/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("omahku-media").upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from("omahku-media").getPublicUrl(filePath);
        finalImageUrl = publicUrl;
      }

      const roomData = {
        name_id: nameId, name_en: nameEn,
        capacity, bed_detail: bedDetail, view_detail: viewDetail,
        description_id: descId, description_en: descEn,
        image_url: finalImageUrl as string,
      };

      if (editId) {
        await supabase.from("villa_rooms").update(roomData).eq("id", editId);
        alert("Data ruangan diperbarui!");
      } else {
        await supabase.from("villa_rooms").insert([roomData]);
        alert("Ruangan baru ditambahkan!");
      }
      resetForm(); fetchRooms();
    } catch (error: any) {
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Hapus data ruangan ini?")) return;
    try {
      await supabase.from("villa_rooms").delete().eq("id", id);
      if (imageUrl.includes("omahku-media")) {
        const path = imageUrl.split("/omahku-media/")[1];
        if (path) await supabase.storage.from("omahku-media").remove([path]);
      }
      fetchRooms();
    } catch (error) {
      alert("Gagal menghapus.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Kelola Ruangan</h1>
          <p className="text-charcoal/60 font-medium">Atur detail ruangan yang ada di dalam villa.</p>
        </div>
        {!showForm && (
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-2 bg-villa-600 hover:bg-villa-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm">
            <Plus size={18} /> Tambah Ruangan
          </button>
        )}
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-3xl border border-villa-100 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-villa-100">
            <h2 className="font-serif text-xl font-bold text-villa-900">{editId ? "Edit Ruangan" : "Ruangan Baru"}</h2>
            <button onClick={resetForm} className="p-2 text-charcoal hover:bg-villa-50 rounded-lg"><X size={20} /></button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-villa-900 mb-2">Foto Ruangan (Rasio 4:3)</label>
              <div className="relative w-full aspect-[4/3] md:aspect-[21/6] rounded-2xl border-2 border-dashed border-villa-200 bg-villa-50 hover:bg-villa-100/50 flex items-center justify-center overflow-hidden group">
                <input type="file" accept="image/*" onChange={(e) => { setFile(e.target.files?.[0] || null); if(e.target.files?.[0]) setPreviewUrl(URL.createObjectURL(e.target.files[0])); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {previewUrl ? (
                  <><Image src={previewUrl} alt="Preview" fill className="object-cover opacity-60 group-hover:opacity-40" /><div className="relative z-10 flex flex-col items-center bg-white/80 p-4 rounded-xl"><UploadCloud size={24} className="mb-1 text-villa-600"/>Klik ubah foto</div></>
                ) : (
                  <div className="flex flex-col items-center text-charcoal/50"><UploadCloud size={40} className="mb-2 text-villa-400" /><span className="text-sm font-medium">Pilih gambar</span></div>
                )}
              </div>
            </div>

            <div><label className="block text-sm font-bold mb-2">Nama Ruangan (ID)</label><input type="text" value={nameId} onChange={(e)=>setNameId(e.target.value)} placeholder="Cth: Kamar Tidur Utama" className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-2">Name (EN)</label><input type="text" value={nameEn} onChange={(e)=>setNameEn(e.target.value)} placeholder="Ex: Master Bedroom" className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>
            
            <div><label className="block text-sm font-bold mb-2">Kapasitas / Info</label><input type="text" value={capacity} onChange={(e)=>setCapacity(e.target.value)} placeholder="Cth: 2 Orang / Area Luas" className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>
            <div><label className="block text-sm font-bold mb-2">Detail Kasur / Furniture</label><input type="text" value={bedDetail} onChange={(e)=>setBedDetail(e.target.value)} placeholder="Cth: 1 King Bed / Sofa L" className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>
            
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Pemandangan / Lokasi</label><input type="text" value={viewDetail} onChange={(e)=>setViewDetail(e.target.value)} placeholder="Cth: Menghadap Kebun" className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>

            <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Deskripsi (ID)</label><textarea rows={3} value={descId} onChange={(e)=>setDescId(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>
            <div className="md:col-span-2"><label className="block text-sm font-bold mb-2">Description (EN)</label><textarea rows={3} value={descEn} onChange={(e)=>setDescEn(e.target.value)} className="w-full bg-white border border-villa-200 rounded-xl py-3 px-4 text-sm" required /></div>

            <div className="md:col-span-2 flex justify-end mt-2 border-t border-villa-100 pt-6 gap-3">
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-villa-50">Batal</button>
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-villa-900 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-villa-800 disabled:opacity-50">
                {isSaving ? <Loader2 size={18} className="animate-spin" /> : (editId ? "Simpan Perubahan" : "Tambah Ruangan")}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64"><Loader2 size={40} className="animate-spin text-villa-300" /></div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-3xl border border-villa-100 p-16 text-center">
          <BedDouble size={48} className="mx-auto text-villa-200 mb-4" />
          <h3 className="font-serif text-xl font-bold mb-2">Belum ada data ruangan</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <motion.div key={room.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-villa-100 hover:shadow-md">
              <div className="relative aspect-[4/3] w-full"><Image src={room.image_url} alt={room.name_id} fill className="object-cover" /></div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-serif text-lg font-bold text-villa-900 mb-2">{room.name_id}</h3>
                <p className="text-xs text-villa-600 font-bold mb-4">{room.capacity} • {room.bed_detail}</p>
                <p className="font-sans text-sm text-charcoal/70 line-clamp-2 mb-6 flex-1">{room.description_id}</p>
                <div className="pt-4 border-t border-villa-100 flex justify-between">
                  <button onClick={() => handleEdit(room)} className="flex items-center gap-1.5 text-xs font-bold text-villa-600 hover:text-villa-900"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(room.id, room.image_url)} className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700"><Trash2 size={14} /> Hapus</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}