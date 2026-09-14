import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.100.143", "192.168.100.*", "localhost"],
};
export default nextConfig;
