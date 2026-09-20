import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { infoPerLevel } from "@/data/infoPerLevel";

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();

  const [showVideo, setShowVideo] = useState(false);

  const levelInfo = infoPerLevel.find((item) => item.id === previewId);
  const targetRoute = levelInfo?.initialRoute ?? `/level/${previewId}`;

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
