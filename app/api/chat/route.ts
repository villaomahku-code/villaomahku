import { GoogleGenerativeAI } from '@google/generative-ai';
import { systemPrompt } from '@/data/ai-prompt';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Pesan tidak boleh kosong' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-3.5-flash-lite',
      systemInstruction: systemPrompt,
    });

    // Format histori obrolan untuk Gemini API
    let formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // BUG FIX: API Gemini mewajibkan history diawali oleh role 'user'.
    // Jika history diawali oleh 'model' (karena pesan sapaan awal UI), kita hapus elemen pertamanya.
    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const latestMessage = messages[messages.length - 1].content;

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(latestMessage);
    const aiResponse = result.response.text();

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Maaf, sistem AI kami sedang mengalami kendala teknis. Silakan hubungi kami via WhatsApp.' },
      { status: 500 }
    );
  }
}