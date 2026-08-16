import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Setup font Inter untuk body/paragraf
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Setup font Playfair Display untuk Heading/Elegan
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Villa Omahku Sumberejo",
  description: "Sebuah Rumah Untuk Beristirahat Dari Riuhnya Dunia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      {/* Menggabungkan variabel font dan memberikan warna default */}
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-cream text-charcoal antialiased`}
      >
        {children}
      </body>
    </html>
  );
}