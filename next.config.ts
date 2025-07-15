import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "groovy-cat-758.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
