export const SITE_CONFIG = {
  name: "Villa Omahku Sumberejo",
  description: "Datang untuk menginap, pulang membawa ketenangan.",
  address: "Sumberejo, Kota Batu, Jawa Timur",
  contact: {
    whatsapp: "61402489758",
    instagram: "https://instagram.com/villaomahku",
    googleMaps: "https://www.google.com/maps/place/Villa+Omah%E2%80%99ku+Sumberejo/@-7.8558928,112.5133008,831m/data=!3m2!1e3!4b1!4m6!3m5!1s0x2e7887a6ff98ee69:0x218c947f9cf3b5ec!8m2!3d-7.8558928!4d112.5133008!16s%2Fg%2F11ssf74nfp"
  },
};

export const getWhatsAppLink = (message?: string) => {
  const baseUrl = `https://wa.me/${SITE_CONFIG.contact.whatsapp}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
};

export const WA_MESSAGES = {
  general: "Halo Villa Omahku, saya ingin bertanya mengenai ketersediaan villa.",
  booking: "Halo Villa Omahku, saya tertarik untuk melakukan reservasi. Boleh minta info ketersediaan dan harganya?",
};