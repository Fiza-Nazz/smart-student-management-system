import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack disabled via --no-turbopack flag in package.json dev script
  // This fixes the Windows drive-letter casing bug with tailwindcss v4
};

export default nextConfig;
