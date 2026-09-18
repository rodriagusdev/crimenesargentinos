import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();

  const [showVideo, setShowVideo] = useState(false);

  const targetRoute =
    previewId === 1 ? "/level/1/1/1" : `/level/${previewId}`;

  useEffect(() => {
    if (showVideo) {
      router.prefetch(targetRoute);
    }
  }, [showVideo, targetRoute, router]);

  const goToLevel = () => {
    try {
      sessionStorage.removeItem(`level_${previewId}_briefing_seen`);
    } catch {
      // Ignorar errores en SSR
    }
    router.push(targetRoute);
  };

  const handleShowVideo = () => {
    try {
      sessionStorage.removeItem(`level_${previewId}_briefing_seen`);
    } catch {
      // Ignorar errores en SSR
    }
    setShowVideo((prev) => !prev);
  };

  return { showVideo, handleShowVideo, goToLevel };
}
