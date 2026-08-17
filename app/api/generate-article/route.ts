import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
export const runtime = 'edge';
// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Gemini API Key belum diatur di .env.local" }, { status: 500 });
    }

    // Menggunakan model Gemini 1.5 Flash (Sangat Cepat & Akurat)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `
    Anda adalah seorang asisten copywriter profesional untuk "Villa Omahku Sumberejo", sebuah villa premium di pegunungan Batu dengan kebun asri, udara sejuk, dan ketenangan alam.
    Tugas Anda: Buatlah sebuah artikel/berita blog berdasarkan topik dari pengguna.
    
    WAJIB KEMBALIKAN DALAM FORMAT JSON MURNI DENGAN STRUKTUR INI (Tanpa awalan \`\`\`json):
    { 
      "titleId": "Judul artikel bahasa Indonesia yang menarik",
      "titleEn": "English translated attractive title",
      "contentId": "Isi artikel bahasa Indonesia. Terdiri dari 2 atau 3 paragraf. Gunakan bahasa yang hangat, elegan, dan mengundang orang untuk menginap.",
      "contentEn": "English translated article content. 2 or 3 paragraphs. Warm, elegant, and inviting tone.",
      "imageKeyword": "Satu kata benda bahasa inggris untuk mengenerate gambar (contoh: mountain, garden, coffee, bed, misty)"
    }

    Topik dari pengguna: ${prompt}
    `;

    const result = await model.generateContent(systemPrompt);
    const responseText = result.response.text();
    
    // Membersihkan formatting markdown jika AI mengembalikannya
    const jsonText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonText);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Gagal membuat artikel dengan AI." }, { status: 500 });
  }
}