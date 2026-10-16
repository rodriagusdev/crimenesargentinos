"use client";

import { useEffect, useState } from "react";
import AdminIcon from "./AdminIcon";

export interface AdminImage {
  label: string;
  url: string;
}

interface Props {
  title: string;
  images: AdminImage[];
  onClose: () => void;
}

// Una imagen del preview: si la ruta no existe se avisa, así se detectan URLs rotas antes de jugar
function PreviewImage({ image }: { image: AdminImage }) {
  const [broken, setBroken] = useState(false);

  return (
    <figure className="flex flex-col gap-2">
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{image.label}</span>
        <span className="font-mono text-xs text-slate-500 truncate" title={image.url}>
          {image.url}
        </span>
      </figcaption>
      <div className="flex items-center justify-center rounded-lg border border-white/[0.06] bg-black/40 min-h-48 overflow-hidden">
        {broken ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-red-200">
            <AdminIcon name="alert" className="size-5 text-red-300" />
            No se encontró la imagen en esa ruta.
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- preview de una URL cualquiera cargada a mano
          <img src={image.url} alt={image.label} className="max-h-[60vh] w-auto object-contain" onError={() => setBroken(true)} />
        )}
      </div>
    </figure>
  );
}

// Modal con el preview de las imágenes de un registro (o de un campo del formulario)
export default function AdminImagePreview({ title, images, onClose }: Props) {
  // Escape cierra el modal
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-xl border border-white/[0.08] bg-[#0d1421] shadow-2xl">
        <div className="flex items-center justify-between px-6 h-14 border-b border-white/[0.06]">
          <h2 className="text-base font-semibold text-slate-50 truncate">{title}</h2>
          <button
            className="inline-flex items-center justify-center size-8 rounded-md text-slate-400 hover:text-slate-100 hover:bg-white/[0.06]"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <AdminIcon name="close" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {images.map((image) => (
            <PreviewImage key={`${image.label}-${image.url}`} image={image} />
          ))}
        </div>
      </div>
    </div>
  );
}
