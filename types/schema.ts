export interface Article {
  id: string;
  title_id: string;
  title_en: string;
  slug: string;
  content_id: string;
  content_en: string;
  image_url: string;
  created_at: string;
  is_published: boolean;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  alt_text_id: string;
  alt_text_en: string;
  category: string; // misal: 'exterior', 'interior', 'facilities'
  created_at: string;
}

export interface VillaRoom {
  id: string;
  name_id: string;
  name_en: string;
  image_url: string;
  image_360_url?: string;
  capacity: string;
  bed_detail: string;
  view_detail: string;
  description_id: string;
  description_en: string;
  created_at: string;
}

// Tipe Data Untuk Konten Halaman Depan Dinamis (Bisa diatur di Admin)
export interface PageContent {
  id: string;
  section_name: string; // misal: 'hero', 'about', 'contact'
  content_data: any; // Format JSON fleksibel untuk teks dinamis
  image_url: string;
  updated_at: string;
}

// Tipe Data untuk Log AI Chat (Bisa dilihat di Admin)
export interface AIChatLog {
  id: string;
  session_id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

// Tipe Data untuk Pengaturan Global (Kontak WA, Harga Master, dll)
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}