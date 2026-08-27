"use client";

import { createPortal } from "react-dom";
import GameButton from "../buttons/GameButton";
import { useEffect, useRef } from "react";

interface Props {
  videoURL?: string;
  onSkip: () => void;
}

export function OverlayVideo({ videoURL, onSkip }: Props) {
  if (typeof window === "undefined") return null;

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.05;
    }
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-9999 bg-black">
      <video
        ref={videoRef}
        src={videoURL}
        autoPlay
        playsInline
        onEnded={onSkip}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute top-6 right-6 z-10">
        <GameButton icon="" label="Saltear" onClick={onSkip} />
      </div>
    </div>,
    document.body,
  );
}
