export const NAVBAR_CONTENT = {
    id: {
      links: [
        { name: "Tentang", href: "#about" },
        { name: "Kamar", href: "#rooms" },
        { name: "Fasilitas", href: "#facilities" },
        { name: "Galeri", href: "#gallery" },
        { name: "Lokasi", href: "#location" },
      ],
      cta: "Reservasi Sekarang"
    },
    en: {
      links: [
        { name: "About", href: "#about" },
        { name: "Rooms", href: "#rooms" },
        { name: "Facilities", href: "#facilities" },
        { name: "Gallery", href: "#gallery" },
        { name: "Location", href: "#location" },
      ],
      cta: "Book Now"
    }
  };
  
  export const ABOUT_CONTENT = {
    id: {
      eyebrow: "Tentang Omahku",
      heading: "Sebuah Rumah Untuk Beristirahat Dari Riuhnya Dunia.",
      paragraphs: [
        "Terletak di pelukan alam Sumberejo, Villa Omahku hadir sebagai pelarian sempurna dari penatnya kehidupan kota. Kami merancang setiap sudutnya untuk menghadirkan kehangatan layaknya rumah sendiri, dipadukan dengan keasrian kebun pribadi yang menenangkan jiwa.",
        "Nikmati udara sejuk pegunungan, hamparan hijau dari taman kami yang menyapa di balik jendela, dan ketenangan yang tak ternilai. Datang untuk menginap, pulang membawa ketenangan."
      ],
      button: "Kenali Kami Lebih Dekat"
    },
    en: {
      eyebrow: "About Omahku",
      heading: "A Home to Rest from the Noise of the World.",
      paragraphs: [
        "Nestled in the embrace of Sumberejo's nature, Villa Omahku serves as the perfect escape from the exhaustion of city life. We designed every corner to provide the warmth of your own home, paired with the serenity of a lush private garden to soothe your soul.",
        "Enjoy the crisp mountain air, the greenery of our garden greeting you through the window, and priceless tranquility. Arrive to stay, return with peace."
      ],
      button: "Get to Know Us Better"
    }
  };
  
  export const HIGHLIGHTS_CONTENT = {
    id: {
      eyebrow: "Keistimewaan",
      heading: "Dirancang Untuk Kenyamanan Anda",
      items: [
        { id: "comfort", title: "Kamar Nyaman", desc: "Fasilitas premium untuk kualitas tidur dan istirahat Anda yang optimal." },
        { id: "garden", title: "Kebun Pribadi Asri", desc: "Taman hijau eksklusif yang luas, tempat sempurna untuk bersantai atau bermain bersama keluarga." },
        { id: "breeze", title: "Udara Sejuk", desc: "Rasakan kesegaran dan kemurnian udara khas pegunungan Batu setiap saat." },
        { id: "privacy", title: "Private & Tenang", desc: "Berada di lokasi eksklusif, jauh dari hiruk pikuk untuk privasi penuh." },
        { id: "family", title: "Ramah Keluarga", desc: "Ruang komunal yang hangat dan luas untuk berkumpul bersama orang tersayang." },
        { id: "access", title: "Akses Mudah", desc: "Tersembunyi di alam, namun tetap sangat mudah dijangkau oleh kendaraan." }
      ]
    },
    en: {
      eyebrow: "Highlights",
      heading: "Designed For Your Comfort",
      items: [
        { id: "comfort", title: "Cozy Rooms", desc: "Premium facilities for your optimal sleep quality and relaxation." },
        { id: "garden", title: "Lush Private Garden", desc: "An exclusive, spacious green garden, perfect for relaxing or playing with family." },
        { id: "breeze", title: "Cool Breeze", desc: "Feel the refreshing and pure mountain air of Batu at all times." },
        { id: "privacy", title: "Private & Serene", desc: "Located in an exclusive area, away from the hustle and bustle for complete privacy." },
        { id: "family", title: "Family Friendly", desc: "Warm and spacious communal areas to gather with your loved ones." },
        { id: "access", title: "Easy Access", desc: "Hidden in nature, yet remains very easily accessible by vehicles." }
      ]
    }
  };
  
  export const ROOMS_CONTENT = {
    id: {
      eyebrow: "Pilihan Menginap",
      heading: "Tempat Nyaman Untuk Beristirahat",
      buttonWa: "Tanya Ketersediaan",
      rooms: [
        {
          id: "omahku-suite",
          name: "Omahku Suite",
          image: "/images/room-1.jpg",
          capacity: "2 Tamu",
          bed: "King Bed",
          view: "Garden View",
          desc: "Kamar elegan yang cocok untuk pasangan. Dilengkapi jendela besar untuk pencahayaan alami dan pemandangan langsung ke arah kebun."
        },
        {
          id: "omahku-family",
          name: "Omahku Family Room",
          image: "/images/room-2.jpg",
          capacity: "2–4 Tamu",
          bed: "King + Sofa Bed",
          view: "Mountain View",
          desc: "Ruang luas yang dirancang untuk kenyamanan keluarga. Memiliki area bersantai khusus dan balkon dengan pemandangan pegunungan."
        }
      ]
    },
    en: {
      eyebrow: "Accommodation",
      heading: "Comfortable Spaces to Rest",
      buttonWa: "Check Availability",
      rooms: [
        {
          id: "omahku-suite",
          name: "Omahku Suite",
          image: "/images/room-1.jpg",
          capacity: "2 Guests",
          bed: "King Bed",
          view: "Garden View",
          desc: "An elegant room perfect for couples. Features large windows for natural lighting and a direct view of our beautiful garden."
        },
        {
          id: "omahku-family",
          name: "Omahku Family Room",
          image: "/images/room-2.jpg",
          capacity: "2–4 Guests",
          bed: "King + Sofa Bed",
          view: "Mountain View",
          desc: "Spacious area designed for family comfort. Includes a dedicated relaxing area and a balcony with mountain views."
        }
      ]
    }
  };
  
  export const FACILITIES_CONTENT = {
    id: {
      eyebrow: "Fasilitas Villa",
      heading: "Semua Yang Anda Butuhkan",
      desc: "Kami menyediakan berbagai fasilitas lengkap untuk memastikan pengalaman menginap Anda di Sumberejo tak terlupakan.",
      items: [
        { id: "garden", title: "Lush Private Garden" },
        { id: "bbq", title: "BBQ Equipment" },
        { id: "kitchen", title: "Fully Equipped Kitchen" },
        { id: "wifi", title: "Free High-Speed WiFi" },
        { id: "water", title: "Hot Water & Amenities" },
        { id: "parking", title: "Private Parking Area" },
      ]
    },
    en: {
      eyebrow: "Villa Facilities",
      heading: "Everything You Need",
      desc: "We provide comprehensive facilities to ensure your stay in Sumberejo is absolutely unforgettable.",
      items: [
        { id: "garden", title: "Lush Private Garden" },
        { id: "bbq", title: "BBQ Equipment" },
        { id: "kitchen", title: "Fully Equipped Kitchen" },
        { id: "wifi", title: "Free High-Speed WiFi" },
        { id: "water", title: "Hot Water & Amenities" },
        { id: "parking", title: "Private Parking Area" },
      ]
    }
  };
  
  export const GALLERY_CONTENT = {
    id: {
      eyebrow: "Galeri Visual",
      heading: "Menangkap Momen, Mengabadikan Ketenangan",
      images: [
        { id: "g1", src: "/images/gallery-1.jpg", alt: "Tampak luar villa saat kabut turun", span: "tall" },
        { id: "g2", src: "/images/gallery-2.jpg", alt: "Ruang keluarga yang luas dan hangat", span: "short" },
        { id: "g3", src: "/images/gallery-3.jpg", alt: "Pemandangan pegunungan dari jendela", span: "short" },
        { id: "g4", src: "/images/gallery-4.jpg", alt: "Kamar tidur utama dengan king bed", span: "tall" },
        { id: "g5", src: "/images/gallery-5.jpg", alt: "Area taman yang hijau", span: "short" },
        { id: "g6", src: "/images/gallery-6.jpg", alt: "Sudut bersantai luar ruangan", span: "short" },
      ]
    },
    en: {
      eyebrow: "Visual Gallery",
      heading: "Capturing Moments, Preserving Tranquility",
      images: [
        { id: "g1", src: "/images/gallery-1.jpg", alt: "Exterior view during the misty morning", span: "tall" },
        { id: "g2", src: "/images/gallery-2.jpg", alt: "Spacious and warm living room", span: "short" },
        { id: "g3", src: "/images/gallery-3.jpg", alt: "Mountain view from the window", span: "short" },
        { id: "g4", src: "/images/gallery-4.jpg", alt: "Master bedroom with king bed", span: "tall" },
        { id: "g5", src: "/images/gallery-5.jpg", alt: "Lush green garden area", span: "short" },
        { id: "g6", src: "/images/gallery-6.jpg", alt: "Outdoor relaxing corner", span: "short" },
      ]
    }
  };
  
  export const EXPERIENCE_CONTENT = {
    id: {
      eyebrow: "Pengalaman Omahku",
      heading: "Lebih Dari Sekadar Tempat Menginap",
      desc: "Berada di tengah alam Sumberejo memberikan Anda kesempatan untuk memperlambat waktu. Nikmati pagi berkabut, seruput kopi hangat Anda, dan ciptakan cerita baru bersama mereka yang berarti.",
      features: [
        { title: "Bersantai di Kebun", desc: "Berjalan tanpa alas kaki di atas rumput berembun, piknik kecil, atau sekadar membaca buku di sudut taman pribadi kami." },
        { title: "Pagi Berkabut", desc: "Sambut matahari terbit dengan udara segar dan kabut tipis khas pegunungan Batu yang menenangkan." },
        { title: "Quality Time", desc: "Ruang komunal yang dirancang untuk mempererat kebersamaan, obrolan hangat, dan tawa keluarga." }
      ]
    },
    en: {
      eyebrow: "Omahku Experience",
      heading: "More Than Just a Place to Stay",
      desc: "Being in the midst of Sumberejo's nature gives you the chance to slow down time. Enjoy the misty mornings, sip your warm coffee, and create new stories with those who matter.",
      features: [
        { title: "Relaxing in the Garden", desc: "Walk barefoot on the dewy grass, have a small picnic, or simply read a book in the corner of our private garden." },
        { title: "Misty Mornings", desc: "Greet the sunrise with fresh air and the soothing light mist typical of the Batu mountains." },
        { title: "Quality Time", desc: "Communal spaces designed to strengthen bonds, warm conversations, and family laughter." }
      ]
    }
  };
  
  export const LOCATION_CONTENT = {
    id: {
      eyebrow: "Temukan Kami",
      heading: "Tersembunyi, Namun Mudah Dijangkau",
      desc: "Villa Omahku terletak di area eksklusif Sumberejo, Kota Batu. Dikelilingi udara pegunungan namun tetap memiliki akses jalan yang sangat bersahabat untuk kendaraan pribadi.",
      btn: "Buka Google Maps"
    },
    en: {
      eyebrow: "Find Us",
      heading: "Hidden, Yet Easily Accessible",
      desc: "Villa Omahku is located in the exclusive area of Sumberejo, Batu City. Surrounded by mountain air while still maintaining very friendly road access for private vehicles.",
      btn: "Open Google Maps"
    }
  };
  
  // --- DATA BARU UNTUK STEP 13 ---
  export const TESTIMONIALS_CONTENT = {
    id: {
      eyebrow: "Kata Mereka",
      heading: "Cerita Dari Mereka Yang Pernah Menginap",
      // TODO: Replace with real guest testimonials
      reviews: [
        { name: "Budi Santoso", date: "Juni 2026", text: "Villa yang sangat luar biasa. Kebunnya sangat asri dan anak-anak saya sangat senang bermain di sana. Pasti akan kembali lagi!" },
        { name: "Sarah Wijaya", date: "Mei 2026", text: "Tempat healing terbaik di Batu. Udara pagi yang berkabut dipadukan dengan secangkir kopi di teras benar-benar mengembalikan energi saya." },
        { name: "Keluarga Pratama", date: "April 2026", text: "Fasilitas sangat lengkap, kamar mandi bersih, dan kasurnya sangat nyaman. Akses ke lokasi juga cukup mudah tidak seperti villa pegunungan lainnya." }
      ]
    },
    en: {
      eyebrow: "Guest Reviews",
      heading: "Stories From Those Who Have Stayed",
      // TODO: Replace with real guest testimonials
      reviews: [
        { name: "Budi Santoso", date: "June 2026", text: "Absolutely wonderful villa. The garden is very lush and my kids loved playing there. Will definitely come back!" },
        { name: "Sarah Wijaya", date: "May 2026", text: "The best healing spot in Batu. The misty morning air combined with a cup of coffee on the terrace truly restored my energy." },
        { name: "Pratama Family", date: "April 2026", text: "Very complete facilities, clean bathrooms, and extremely comfortable beds. Access to the location is also quite easy unlike other mountain villas." }
      ]
    }
  };
  
  export const CTA_CONTENT = {
    id: {
      heading: "Waktunya Beristirahat Sejenak.",
      desc: "Biarkan suasana asri dan kehangatan Villa Omahku Sumberejo membawa Anda lebih dekat pada ketenangan yang Anda cari.",
      btnPrimary: "Reservasi Sekarang",
      btnSecondary: "Tanya Via WhatsApp"
    },
    en: {
      heading: "Time to Take a Break.",
      desc: "Let the lush atmosphere and warmth of Villa Omahku Sumberejo bring you closer to the tranquility you seek.",
      btnPrimary: "Book Now",
      btnSecondary: "Ask via WhatsApp"
    }
  };
  
  export const FOOTER_CONTENT = {
    id: {
      desc: "Menghadirkan pengalaman menginap premium yang menyatu dengan keindahan alam pegunungan Batu.",
      quickLinks: "Tautan Cepat",
      contact: "Kontak Kami",
      rights: "Seluruh hak cipta dilindungi."
    },
    en: {
      desc: "Delivering a premium stay experience that blends with the natural beauty of the Batu mountains.",
      quickLinks: "Quick Links",
      contact: "Contact Us",
      rights: "All rights reserved."
    }
  };