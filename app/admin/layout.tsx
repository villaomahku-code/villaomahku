"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Jika TIDAK ADA session dan mencoba masuk selain ke halaman login -> Tendang ke login
      if (!session && pathname !== "/admin/login") {
        router.push("/admin/login");
      } 
      // Jika ADA session dan mencoba buka halaman login -> Tendang ke dashboard
      else if (session && pathname === "/admin/login") {
        router.push("/admin/dashboard");
      }
      
      setIsLoading(false);
    };

    checkSession();
  }, [pathname, router]);

  // Tampilan loading sementara saat satpam mengecek
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="animate-spin text-villa-600" size={40} />
      </div>
    );
  }

  // Jika sedang di halaman login, jangan tampilkan Sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Jika di halaman dashboard/artikel/galeri, tampilkan Sidebar
  return (
    <div className="min-h-screen bg-villa-50 flex">
      <AdminSidebar />
      {/* Konten utama bergeser ke kanan di mode Desktop untuk memberi ruang Sidebar */}
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-8 px-6 lg:px-10 pb-10 transition-all overflow-hidden">
        {children}
      </main>
    </div>
  );
}