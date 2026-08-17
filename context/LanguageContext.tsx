"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "id" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("id");

  // Mengecek apakah user sebelumnya sudah pernah memilih bahasa (simpan di Local Storage)
  useEffect(() => {
    const savedLang = localStorage.getItem("villa_lang") as Language;
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  // Fungsi untuk menukar bahasa
  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === "id" ? "en" : "id";
      localStorage.setItem("villa_lang", newLang);
      return newLang;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook kustom agar komponen lain mudah mengakses bahasa
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}