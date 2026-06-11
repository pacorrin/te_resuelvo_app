import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "typeorm",
    "mysql2",
    "reflect-metadata",
    "nodemailer",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
