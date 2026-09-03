import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "izmvbsuvtsgziwegkdmq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "image.pollinations.ai", // Izin untuk AI Image Generator
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;