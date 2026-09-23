import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { gameData } from "@/data/gameData";

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();

  const [showVideo, setShowVideo] = useState(false);

  const levelInfo = gameData.find((game) => game.levelId === previewId);
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
    }
    router.push(targetRoute);
  };

  const handleShowVideo = () => {
    try {
      sessionStorage.removeItem(`level_${previewId}_briefing_seen`);
    } catch {
    }
    setShowVideo((prev) => !prev);
  };

  return { showVideo, handleShowVideo, goToLevel };
}
