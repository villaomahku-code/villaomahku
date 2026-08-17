"use client";

import { motion } from "framer-motion";
import { FileText, ImagePlus, ArrowRight, BedDouble, MonitorPlay } from "lucide-react";
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

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial="hidden" animate="visible" variants={fadeUp} className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-villa-950 mb-2">Selamat Datang, Admin!</h1>
        <p className="text-charcoal/60 font-medium">Login sebagai: <span className="text-villa-600">{adminEmail}</span></p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Kartu Halaman Depan */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}>
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col">
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
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col">
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
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col">
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
          <div className="bg-white p-6 rounded-3xl border border-villa-100 shadow-sm hover:shadow-md h-full flex flex-col">
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
    </div>
  );
}