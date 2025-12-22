/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // hindari 400 dari image optimizer, langsung pakai URL asli
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "ggwp.id",
      },
      {
        protocol: "https",
        hostname: "www.ggwp.id",
      },
      {
        protocol: "https",
        hostname: "image.ggwp.id",
      },
      {
        protocol: "https",
        hostname: "cdn.ggwp.id",
      },
      {
        protocol: "https",
        hostname: "bluestacks.com",
      },
      {
        protocol: "https",
        hostname: "www.bluestacks.com",
      },
      {
        protocol: "https",
        hostname: "cdn.bluestacks.com",
      },
      {
        protocol: "https",
        hostname: "cdn-www.bluestacks.com",
      },
    ],
  },
};

module.exports = nextConfig;
