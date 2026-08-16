export const SITE_CONFIG = {
    name: "Villa Omahku Sumberejo",
    description: "Datang untuk menginap, pulang membawa ketenangan.",
    address: "[ALAMAT VILLA] Sumberejo, Batu, Jawa Timur",
    contact: {
      // Gunakan format 62 tanpa + atau 0 di depan
      whatsapp: "6281234567890", // TODO: Ganti dengan nomor asli nanti
      instagram: "https://instagram.com/villaomahku",
      googleMaps: "https://maps.google.com/...", // TODO: Ganti dengan link GMaps asli
    },
  };
  
  /**
   * Helper function untuk membuat link WhatsApp dinamis
   * @param message Pesan template (opsional)
   * @returns String URL WhatsApp
   */
  export const getWhatsAppLink = (message?: string) => {
    const baseUrl = `https://wa.me/${SITE_CONFIG.contact.whatsapp}`;
    if (message) {
      return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    return baseUrl;
  };
  
  // Preset pesan untuk reservasi
  export const WA_MESSAGES = {
    general: "Halo Villa Omahku, saya ingin bertanya mengenai ketersediaan villa.",
    booking: "Halo Villa Omahku, saya tertarik untuk melakukan reservasi. Boleh minta info ketersediaan dan harganya?",
  };