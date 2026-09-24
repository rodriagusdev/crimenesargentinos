import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Evita que Turbopack tome C:\Desarrollo\crimenesarg como raíz por el package-lock.json de la carpeta padre
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
