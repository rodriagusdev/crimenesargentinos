import { ReactNode } from "react";
import { Inter } from "next/font/google";
import AdminShell from "@/components/admin/AdminShell";

// El panel usa una tipografía de lectura en lugar de la pixelada del juego
const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={inter.className}>
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
