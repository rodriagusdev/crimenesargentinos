"use client";

import { useEffect, useRef, useState } from "react";

interface SeamlessBackgroundVideoProps {
  src: string;
  poster?: string;
  fadeDuration?: number; // Duration of crossfade in seconds (default: 0.8s)
  className?: string;
}

/**
 * Renders a dual-buffered looping video background that crossfades seamlessly before
 * reaching the end of the clip, eliminating the browser decoder seek stutter / black glitch.
 */
export default function SeamlessBackgroundVideo({
  src,
  poster,
  fadeDuration = 0.8,
  className = "absolute inset-0 h-full w-full object-cover pointer-events-none",
}: SeamlessBackgroundVideoProps) {
  const v0Ref = useRef<HTMLVideoElement>(null);
  const v1Ref = useRef<HTMLVideoElement>(null);

  const [active, setActive] = useState<0 | 1>(0);
  const activeRef = useRef<0 | 1>(0);
  activeRef.current = active;

  const [v0Opacity, setV0Opacity] = useState<number>(1);
  const [v1Opacity, setV1Opacity] = useState<number>(0);
  const [transitionEnabled, setTransitionEnabled] = useState<boolean>(true);

  const isFadingRef = useRef<boolean>(false);

  const triggerFade = (currentIdx: 0 | 1) => {
    if (isFadingRef.current) return;
    isFadingRef.current = true;

    const current = currentIdx === 0 ? v0Ref.current : v1Ref.current;
    const incoming = currentIdx === 0 ? v1Ref.current : v0Ref.current;
    if (!current || !incoming) {
      isFadingRef.current = false;
      return;
    }

    setTransitionEnabled(true);

    // Start incoming video from the beginning
    incoming.currentTime = 0;
    incoming.play().catch(() => {});

    // Fade in incoming video on top of current
    if (currentIdx === 0) {
      setV1Opacity(1);
    } else {
      setV0Opacity(1);
    }

    // Once crossfade duration finishes
    setTimeout(() => {
      current.pause();
      current.currentTime = 0;

      // Disable transition temporarily to reset outgoing opacity without reverse animation
      setTransitionEnabled(false);

      if (currentIdx === 0) {
        setV0Opacity(0);
        setActive(1);
      } else {
        setV1Opacity(0);
        setActive(0);
      }

      // Re-enable transitions on next animation frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionEnabled(true);
          isFadingRef.current = false;
        });
      });
    }, fadeDuration * 1000);
  };

  useEffect(() => {
    const v0 = v0Ref.current;
    const v1 = v1Ref.current;
    if (!v0 || !v1) return;

    v0.muted = true;
    v1.muted = true;

    // Start initial video
    v0.play().catch(() => {});

    let animId: number;

    const checkTime = () => {
      const current = activeRef.current === 0 ? v0 : v1;

      if (
        current &&
        current.duration &&
        !isFadingRef.current &&
        current.currentTime > 0.5
      ) {
        const remaining = current.duration - current.currentTime;
        if (remaining <= fadeDuration) {
          triggerFade(activeRef.current);
        }
      }

      animId = requestAnimationFrame(checkTime);
    };

    animId = requestAnimationFrame(checkTime);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [fadeDuration, src]);

  // Video on top during fade
  const v0ZIndex = active === 0 ? 1 : 2;
  const v1ZIndex = active === 1 ? 1 : 2;

  const transitionStyle = transitionEnabled
    ? `opacity ${fadeDuration}s ease-in-out`
    : "none";

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <video
        ref={v0Ref}
        src={src}
        poster={poster}
        muted
        playsInline
        preload="auto"
        onEnded={() => triggerFade(0)}
        className={className}
        style={{
          opacity: v0Opacity,
          zIndex: v0ZIndex,
          transition: transitionStyle,
        }}
      />
      <video
        ref={v1Ref}
        src={src}
        muted
        playsInline
        preload="auto"
        onEnded={() => triggerFade(1)}
        className={className}
        style={{
          opacity: v1Opacity,
          zIndex: v1ZIndex,
          transition: transitionStyle,
        }}
      />
    </div>
  );
}
