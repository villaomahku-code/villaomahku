// File: app/api/keep-alive/route.ts

export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Pastikan path ini sesuai dengan file konfigurasi Supabase Anda

export async function GET() {
  try {
    // Melakukan query sangat ringan ke tabel 'page_content' (hanya ambil 1 data ID)
    // Ini sudah cukup untuk memberi tahu Supabase bahwa database sedang digunakan
    const { data, error } = await supabase
      .from('page_content')
      .select('section_name')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({ 
      status: 'success', 
      message: 'Supabase berhasil disapa dan tetap bangun!',
      time: new Date().toISOString()
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: 'error', message: error.message }, 
      { status: 500 }
    );
  }
}