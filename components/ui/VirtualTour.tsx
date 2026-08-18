"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { ComponentType } from "react";

// 1. Kita buatkan "Kamus" manual untuk TypeScript agar mengenali properti Pannellum
interface PannellumProps {
  width?: string;
  height?: string;
  image?: string;
  pitch?: number;
  yaw?: number;
  hfov?: number;
  autoLoad?: boolean;
  showZoomCtrl?: boolean;
  mouseZoom?: boolean;
  onLoad?: () => void;
}

// 2. Kita beritahu next/dynamic untuk menggunakan "Kamus" (PannellumProps) yang baru kita buat
const PannellumViewer = dynamic<PannellumProps>(
  () => import("pannellum-react").then((mod) => mod.Pannellum as ComponentType<PannellumProps>),
  {
    ssr: false, // Wajib dimatikan agar tidak error window undefined
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-villa-950/10">
        <Loader2 className="animate-spin text-villa-500" size={40} />
      </div>
    ),
  }
);

interface VirtualTourProps {
  imageUrl: string;
}

export default function VirtualTour({ imageUrl }: VirtualTourProps) {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <PannellumViewer
        width="100%"
        height="100%"
        image={imageUrl}
        pitch={0}
        yaw={0}
        hfov={100}
        autoLoad={true}
        showZoomCtrl={false}
        mouseZoom={true}
        onLoad={() => console.log("Panorama 360 berhasil dimuat")}
      />
    </div>
  );
}