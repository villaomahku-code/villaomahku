"use client";

import Link from "next/link";
import { MapPin, Phone } from "lucide-react"; // Ikon Instagram dihapus dari sini
import { useLanguage } from "@/context/LanguageContext";
import { FOOTER_CONTENT } from "@/data/content";
import { SITE_CONFIG } from "@/data/config";

export default function Footer() {
  const { language } = useLanguage();
  const content = FOOTER_CONTENT[language];
  const navLinks = [
    { name: "Tentang", enName: "About", href: "#about" },
    { name: "Kamar", enName: "Rooms", href: "#rooms" },
    { name: "Fasilitas", enName: "Facilities", href: "#facilities" },
    { name: "Galeri", enName: "Gallery", href: "#gallery" },
  ];

  return (
    <footer className="bg-villa-950 text-villa-50 py-16 border-t border-villa-900">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
          
          {/* Brand & Desc */}
          <div className="flex flex-col items-start">
            <Link href="/" className="font-serif text-3xl font-bold tracking-wide mb-6">
              Omahku<span className="text-villa-500">.</span>
            </Link>
            <p className="font-sans text-sm text-villa-200 leading-relaxed mb-8 max-w-sm">
              {content.desc}
            </p>
            <div className="flex items-center gap-4">
              <a href={SITE_CONFIG.contact.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-villa-900 text-villa-300 hover:bg-villa-500 hover:text-white transition-colors">
                
                {/* Menggunakan SVG Native Instagram sebagai pengganti Lucide */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans font-bold text-lg mb-6 text-white">{content.quickLinks}</h4>
            <ul className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-villa-200 hover:text-villa-400 transition-colors">
                    {language === "id" ? link.name : link.enName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-sans font-bold text-lg mb-6 text-white">{content.contact}</h4>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-3 text-sm text-villa-200">
                <MapPin size={18} className="text-villa-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{SITE_CONFIG.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-villa-200">
                <Phone size={18} className="text-villa-500 flex-shrink-0" />
                <span>+{SITE_CONFIG.contact.whatsapp}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-villa-900/50 text-xs text-villa-400">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. {content.rights}</p>
          <p className="mt-2 md:mt-0">Sumberejo, Batu</p>
        </div>
      </div>
    </footer>
  );
}