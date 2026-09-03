'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, PhoneCall, Sparkles } from 'lucide-react';
import { getWhatsAppLink } from '@/data/config';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: 'Halo! 👋 Saya asisten virtual Omah\'ku Sumberejo. Untuk mengecek ketersediaan atau harga, boleh infokan rencana tanggal check-in Anda?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Fitur Auto-Open: Buka chat otomatis setelah 2.5 detik website dimuat
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasAutoOpened) {
        setIsOpen(true);
        setHasAutoOpened(true);
      }
    }, 2500); // Waktu jeda sebelum chat melompat terbuka (2.5 detik)
    
    return () => clearTimeout(timer);
  }, [hasAutoOpened]);

  // Fungsi pintar untuk mengubah teks URL menjadi Link Clickable
  const formatMessage = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) => 
      urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-emerald-100 underline font-bold break-all hover:text-white transition-colors">
          {part.includes('wa.me') ? 'Klik di sini untuk kirim format ke Admin' : part}
        </a>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'model', content: data.response }]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        content: 'Maaf, saya sedang mengalami kendala teknis. Silakan klik tombol WhatsApp di bawah untuk langsung terhubung dengan tim kami.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tombol Floating */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 p-4 rounded-full bg-emerald-700 text-white shadow-xl z-50 flex items-center justify-center group"
          >
            <MessageCircle size={28} className="group-hover:animate-pulse" />
            
            {/* Tooltip kecil memanggil tamu */}
            <div className="absolute right-full mr-4 bg-white text-villa-900 text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center gap-2">
              Ada yang bisa dibantu? <span className="text-lg">👇</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Kotak Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 w-[360px] h-[550px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] flex flex-col z-50 overflow-hidden border border-gray-100"
          >
            {/* Header dengan Mascot Waving Hand & Efek Kilauan */}
            <div className="bg-emerald-700 text-white p-4 flex justify-between items-center relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                <Sparkles size={80} />
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                {/* Mascot / GIF Lucu */}
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1 shadow-md border-2 border-emerald-500/30">
                  <img 
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif" 
                    alt="Robo Villa" 
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">Omahku AI</h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Online & Siap bantu!
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-emerald-100 hover:text-white hover:bg-emerald-600/50 p-2 rounded-xl transition-colors relative z-10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Area Pesan */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] scroll-smooth">
              {messages.map((msg, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={index} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.role === 'model' && msg.content.includes('wa.me') 
                      ? <div className="bg-emerald-700 text-white p-3.5 rounded-xl shadow-inner mt-1">{formatMessage(msg.content)}</div>
                      : formatMessage(msg.content)
                    }
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Tombol Fallback WA */}
            <div className="px-4 py-2.5 bg-white border-t border-gray-100 z-10 shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.05)]">
               <a 
                  href={getWhatsAppLink("Halo admin Omah'ku, saya butuh bantuan manual terkait villa.")}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
               >
                  <PhoneCall size={14} />
                  Hubungi Admin (WhatsApp)
               </a>
            </div>

            {/* Form Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya harga, tanggal, dll..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-gray-700"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-all flex-shrink-0 shadow-md"
              >
                <Send size={18} className={input.trim() ? 'translate-x-0.5' : ''} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}