import HideScrollbar from "@/components/HideScrollbar";

// Galería de bocetos: sin barra de scroll vertical visible
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HideScrollbar />
      {children}
    </>
  );
}
