import { NextConfig } from "next";

const nextConfig: NextConfig = {

  async rewrites() {
    return [
      {
        source: "/api/:path*", // ✅ Corrected: source must start with '/'
        destination: "http://127.0.0.1:8000/api/:path*", // ✅ Proxying request correctly
      },
    ];
  },
};

export default nextConfig;
