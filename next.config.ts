/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "izmvbsuvtsgziwegkdmq.supabase.co", 
        port: "",
        pathname: "/storage/v1/object/public/**", 
      },
      {
        protocol: "https",
        hostname: "image.pollinations.ai", // Izin untuk AI Image Generator
        port: "",
        pathname: "/**",
      }
    ],
  },
};
export default nextConfig;