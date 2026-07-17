import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone testing via LAN IP (HMR + dev assets)
  allowedDevOrigins: ["192.168.1.16"],
};

export default nextConfig;
