"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Mail, Key, ArrowRight, Loader2, Leaf } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Gagal masuk. Periksa kembali kredensial Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-cream relative overflow-hidden">
      
      {/* Background Effects (Nature/Mist Theme) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-white blur-[120px] opacity-80 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-villa-200/50 blur-[100px] opacity-60" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md p-8 md:p-10"
      >
        <div className="bg-white/60 backdrop-blur-2xl rounded-[2.5rem] border border-white p-8 shadow-2xl shadow-villa-900/5">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-villa-50 border border-villa-100 flex items-center justify-center mb-6 shadow-sm">
              <Leaf className="text-villa-600" size={28} />
            </div>
            <h1 className="font-serif text-2xl text-villa-950 font-bold tracking-wide">
              Omahku Portal
            </h1>
            <p className="text-sm text-charcoal/60 mt-2 font-sans font-medium">
              Manajemen Konten Villa
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                className="bg-red-50 border border-red-100 text-red-600 text-sm p-4 rounded-xl text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-villa-800 uppercase tracking-wider pl-1">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-villa-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/80 border border-villa-100 rounded-xl py-3.5 pl-12 pr-4 text-villa-900 placeholder-villa-300 focus:outline-none focus:ring-2 focus:ring-villa-500/50 focus:border-villa-500/50 transition-all font-sans text-sm shadow-sm"
                  placeholder="admin@omahku.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-villa-800 uppercase tracking-wider pl-1">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Key size={18} className="text-villa-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/80 border border-villa-100 rounded-xl py-3.5 pl-12 pr-4 text-villa-900 placeholder-villa-300 focus:outline-none focus:ring-2 focus:ring-villa-500/50 focus:border-villa-500/50 transition-all font-sans text-sm shadow-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-villa-700 hover:bg-villa-600 text-white rounded-xl py-3.5 font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4 group shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Masuk Sistem
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

        </div>
      </motion.div>
    </main>
  );
}