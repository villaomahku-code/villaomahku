"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ImagePlus, FileText, LogOut, Menu, X, Leaf, BedDouble, MonitorPlay } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { name: "Kelola Halaman", icon: MonitorPlay, href: "/admin/pages" },
    { name: "Kelola Ruangan", icon: BedDouble, href: "/admin/rooms" },
    { name: "Kelola Artikel", icon: FileText, href: "/admin/articles" },
    { name: "Kelola Galeri", icon: ImagePlus, href: "/admin/gallery" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white border-r border-villa-100 shadow-sm w-64">
      <div className="p-6 border-b border-villa-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-villa-50 flex items-center justify-center">
            <Leaf className="text-villa-600" size={20} />
          </div>
          <div>
            <h2 className="font-serif font-bold text-villa-950 text-lg">Omahku</h2>
            <p className="text-xs text-charcoal/50 font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isActive
                  ? "bg-villa-600 text-white shadow-md shadow-villa-600/20"
                  : "text-villa-800 hover:bg-villa-50 hover:text-villa-900"
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-villa-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-villa-100 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Leaf className="text-villa-600" size={20} />
          <span className="font-serif font-bold text-villa-900">Omahku Admin</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-villa-900 focus:outline-none">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-villa-950/20 backdrop-blur-sm z-40 transition-opacity" 
          onClick={() => setIsOpen(false)} 
        />
      )}

      {/* Sidebar (Fixed Desktop & Sliding Mobile) */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:pt-0 pt-16`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}