import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "paeyking-store.sfo3.digitaloceanspaces.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "paeyking-store.sfo3.digitaloceanspaces.com",
        pathname: "/products/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/fkzn0avi/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
