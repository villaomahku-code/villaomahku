"use client";

import { motion } from "framer-motion";
import { FileText, ImagePlus, ArrowRight, BedDouble, MonitorPlay, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [adminEmail, setAdminEmail] = useState<string>("");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setAdminEmail(user.email);
      }
    };
    getUser();
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Dummy Data Chat AI (Nanti bisa dihubungkan ke Supabase)
  const dummyChatLogs = [
    { id: 1, date: '12 Okt 2023 14:30', user: 'Ada kamar kosong tgl 15?', status: 'Diarahkan ke WA' },
    { id: 2, date: '12 Okt 2023 10:15', user: 'Berapa harga weekend?', status: 'Dijawab AI' },
    { id: 3, date: '11 Okt 2023 18:45', user: 'Boleh bawa anjing peliharaan?', status: 'Dijawab AI' },
    { id: 4, date: '10 Okt 2023 09:10', user: 'Lokasinya dimana ya kak?', status: 'Dijawab AI' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Selamat Datang, Admin!</h1>
        <p className="text-charcoal/60 font-medium">Login sebagai: <span className="text-villa-600">{adminEmail}</span></p>
      </motion.div>

      {/* Grid Navigasi Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Kartu Halaman Depan */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-villa-50 flex items-center justify-center mb-4">
              <MonitorPlay className="text-villa-600" size={24} />
            </div>
            <h2 className="text-lg font-bold text-villa-900 mb-2">Halaman Depan</h2>
            <p className="text-charcoal/70 mb-6 text-sm flex-1">Ubah teks dan foto pada section Hero, About, dan Experience.</p>
            <Link href="/admin/pages" className="inline-flex items-center gap-2 text-sm text-villa-700 font-bold hover:text-villa-500 group">
              Kelola Tampilan <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Kartu Ruangan */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}>
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-villa-50 flex items-center justify-center mb-4">
              <BedDouble className="text-villa-600" size={24} />
            </div>
            <h2 className="text-lg font-bold text-villa-900 mb-2">Kamar & Ruang</h2>
            <p className="text-charcoal/70 mb-6 text-sm flex-1">Atur detail ruangan yang ada di dalam villa.</p>
            <Link href="/admin/rooms" className="inline-flex items-center gap-2 text-sm text-villa-700 font-bold hover:text-villa-500 group">
              Kelola Ruangan <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Kartu Artikel */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3 }}>
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-villa-50 flex items-center justify-center mb-4">
              <FileText className="text-villa-600" size={24} />
            </div>
            <h2 className="text-lg font-bold text-villa-900 mb-2">Artikel & Blog</h2>
            <p className="text-charcoal/70 mb-6 text-sm flex-1">Tambahkan berita atau promo dengan bantuan AI.</p>
            <Link href="/admin/articles" className="inline-flex items-center gap-2 text-sm text-villa-700 font-bold hover:text-villa-500 group">
              Kelola Artikel <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        {/* Kartu Galeri */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.4 }}>
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-villa-50 flex items-center justify-center mb-4">
              <ImagePlus className="text-villa-600" size={24} />
            </div>
            <h2 className="text-lg font-bold text-villa-900 mb-2">Galeri Foto</h2>
            <p className="text-charcoal/70 mb-6 text-sm flex-1">Unggah atau hapus foto galeri di halaman depan.</p>
            <Link href="/admin/gallery" className="inline-flex items-center gap-2 text-sm text-villa-700 font-bold hover:text-villa-500 group">
              Kelola Galeri <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bagian Monitoring AI */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.5 }}>
        <div className="bg-white rounded-3xl shadow-sm border border-villa-100 overflow-hidden mt-8">
          <div className="p-6 border-b border-villa-50 flex justify-between items-center bg-villa-50/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="text-villa-600" size={20} />
              <h2 className="text-lg font-bold text-villa-900">Log Chat AI Terbaru</h2>
            </div>
            <span className="text-xs font-medium bg-white px-3 py-1 rounded-full border border-villa-100 text-charcoal/60">
              Live Monitoring
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-charcoal">
              <thead className="bg-white border-b border-villa-50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-villa-900">Tanggal & Waktu</th>
                  <th className="px-6 py-4 font-semibold text-villa-900">Pesan Masuk (Tamu)</th>
                  <th className="px-6 py-4 font-semibold text-villa-900">Status Tindakan AI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-villa-50 bg-white">
                {dummyChatLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-villa-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-charcoal/70">{log.date}</td>
                    <td className="px-6 py-4 font-medium max-w-md truncate">"{log.user}"</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        log.status.includes('WA') 
                          ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Tombol Lihat Semua */}
          <div className="p-4 bg-white border-t border-villa-50 text-center">
            <button className="text-sm font-bold text-villa-600 hover:text-villa-800 transition-colors">
              Lihat Seluruh Riwayat Chat
            </button>
          </div>
        </div>
      </motion.div>

    </div>
  );
}