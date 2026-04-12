import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'piv8bchfkyj5ozqd.public.blob.vercel-storage.com',
        port: '',
        search: '',
        pathname: '/assets/**',
      },
    ],
  },
};

export default nextConfig;
