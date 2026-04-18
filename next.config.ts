import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["typeorm", "mysql2", "reflect-metadata"],
};

export default nextConfig;
