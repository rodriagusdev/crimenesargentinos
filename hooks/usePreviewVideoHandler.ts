import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    if (showVideo) {
      router.prefetch(`/level/${previewId}`);
    }
  }, [showVideo, previewId, router]);

  const goToLevel = () => {
    router.push(`/level/${previewId}`);
  };

  const handleShowVideo = () => {
    setShowVideo((prev) => !prev);
  };

  return { showVideo, handleShowVideo, goToLevel };
}
