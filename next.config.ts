import type { NextConfig } from "next";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

// Las imágenes que se suben desde el panel las sirve el backend en {API}/uploads/...
function apiUploadsPattern() {
  try {
    const api = new URL(process.env.NEXT_PUBLIC_API_URL ?? "");
    return [{
      protocol: api.protocol.replace(":", "") as "http" | "https",
      hostname: api.hostname,
      port: api.port,
      pathname: "/uploads/**",
    }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    // Evita que Turbopack tome C:\Desarrollo\crimenesarg como raíz por el package-lock.json de la carpeta padre
    root: path.resolve(__dirname),
  },
  devIndicators: false,
  images: {
    // En desarrollo servimos directamente las imágenes estáticas para evitar bloqueos de CPU con Sharp
    unoptimized: isDev,
    formats: ["image/webp"],
    remotePatterns: apiUploadsPattern(),
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días de caché
  },
};

export default nextConfig;
