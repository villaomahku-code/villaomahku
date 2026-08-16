"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { getWhatsAppLink, WA_MESSAGES } from "@/data/config";

const NAV_LINKS = [
  { name: "Tentang", href: "#about" },
  { name: "Kamar", href: "#rooms" },
  { name: "Fasilitas", href: "#facilities" },
  { name: "Galeri", href: "#gallery" },
  { name: "Lokasi", href: "#location" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Deteksi scroll untuk mengubah style Navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Generate link WhatsApp dinamis dari config
  const waLink = getWhatsAppLink(WA_MESSAGES.general);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled
          ? "bg-cream/90 backdrop-blur-md shadow-sm py-4 text-villa-900" // Glass effect
          : "bg-transparent py-6 text-white" // Transparent effect
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-serif text-2xl font-bold tracking-wide">
          Omahku<span className="text-villa-500">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`transition-colors ${
                isScrolled ? "hover:text-villa-500" : "hover:text-villa-200"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="hidden md:block">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-villa-600 hover:bg-villa-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            Reservasi Sekarang
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-cream shadow-lg border-t border-villa-100">
          <div className="flex flex-col px-6 py-4 gap-4 text-villa-900">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-medium hover:text-villa-500 py-2 border-b border-villa-100/50"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-villa-600 text-center text-white px-6 py-3 rounded-full text-sm font-medium mt-4"
            >
              Reservasi Sekarang
            </a>
          </div>
        </div>
      )}
    </header>
  );
}