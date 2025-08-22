import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/js/:path*',
        destination: '/js/:path*',
      },
      {
        source: '/assets/:path*',
        destination: '/assets/:path*',
      },
      {
        source: '/Logo.svg',
        destination: '/Logo.svg',
      },
    ];
  },
};

export default nextConfig;
