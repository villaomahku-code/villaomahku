export interface Article {
    id: string;
    title_id: string;
    title_en: string;
    slug: string;
    content_id: string;
    content_en: string;
    image_url: string;
    created_at: string;
  }
  
  export interface GalleryImage {
    id: string;
    image_url: string;
    alt_text_id: string;
    alt_text_en: string;
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
  
  // Tipe Data Baru Untuk Konten Halaman Depan Dinamis
  export interface PageContent {
    section_name: string;
    content_data: any; // Format JSON fleksibel
    image_url: string;
  }