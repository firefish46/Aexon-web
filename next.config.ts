import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  // Product check page from the packaging QR code, served from public/verify.html
  async rewrites() {
    return [{ source: "/verify", destination: "/verify.html" }];
  },
};

export default nextConfig;
