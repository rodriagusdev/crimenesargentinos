import { useRouter } from "next/navigation";
import { useState } from "react";

export function usePreviewVideoHandler(previewId: number) {
  const router = useRouter();

  const [showVideo, setShowVideo] = useState(false);

  const goToLevel = () => {
    handleShowVideo();
    router.push(`/level/${previewId}`);
  };

  const handleShowVideo = () => {
    setShowVideo(!showVideo);
  }
  
  return {showVideo, handleShowVideo, goToLevel}
}
