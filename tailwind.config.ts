import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet warna alam (Forest, Leaf, Sage)
        villa: {
          50: '#F7F9F6',  // Lightest cream/sage
          100: '#EAEFE8',
          200: '#D2DFCE',
          300: '#AEC6A8',
          400: '#84A67C',
          500: '#62895A', // Leaf Green (Primary)
          600: '#4A6C43', // Forest Green (Hover/Focus)
          700: '#3A5435',
          800: '#30442D',
          900: '#283826', // Darkest Green (Headings)
          950: '#151F14',
        },
        cream: '#FAF9F6', // Warm white untuk background utama
        charcoal: '#2D3748', // Warna teks utama (bukan hitam pekat)
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;