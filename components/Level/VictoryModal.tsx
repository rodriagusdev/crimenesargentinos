"use client";

import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameSessionStore } from "@/stores/useGameSessionStore";
import { getLevelProvinces } from "@/services/levelService";
import CronicaVictoryNewspaper from "./CronicaVictoryNewspaper";
import { clearAllBriefingSeenFlags } from "@/lib/briefingStorage";

interface VictoryModalProps {
  levelId: number;
}

function getDetectiveRank(
  hoursTaken: number,
  initialTime: number,
  remainingPI: number,
  score: number
): string {
  const timePercentRemaining =
    initialTime > 0 ? ((initialTime - hoursTaken) / initialTime) * 100 : 50;

  // S+ : Desempeño impecable (resolución ultrarrápida o >= 70% de tiempo + presupuesto intactos)
  if (hoursTaken <= 10 || (timePercentRemaining >= 70 && remainingPI >= 10) || score >= 4500) {
    return "S+";
  }
  // S : Sobresaliente (<= 15 horas o >= 55% de tiempo restante)
  if (hoursTaken <= 15 || timePercentRemaining >= 55 || score >= 3500) {
    return "S";
  }
  // A : Notable (<= 21 horas o >= 40% de tiempo restante)
  if (hoursTaken <= 21 || timePercentRemaining >= 40 || score >= 2500) {
    return "A";
  }
  // B : Bueno (<= 28 horas o >= 20% de tiempo restante)
  if (hoursTaken <= 28 || timePercentRemaining >= 20 || score >= 1500) {
    return "B";
  }
  // C : Victoria ajustada (se agotó casi todo el tiempo)
  return "C";
}

export default function VictoryModal({ levelId }: VictoryModalProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [provinceName, setProvinceName] = useState<string>("BUENOS AIRES");

  const isVictory = useGameSessionStore((state) => state.isVictory);
  const session = useGameSessionStore((state) => state.session);
  const warrantSuspectId = session?.warrantSuspectId ?? null;
  const suspects = useGameSessionStore((state) => state.suspects);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch province name for the headline: ¡ATRAPADO EN [PROVINCIA]!
  useEffect(() => {
    if (session?.currentProvinceId && levelId) {
      getLevelProvinces(levelId)
        .then((data) => {
          const found = data.provinces.find((p) => p.id === session.currentProvinceId);
          if (found) {
            setProvinceName(found.name.toUpperCase());
          }
        })
        .catch(() => {});
    }
  }, [session?.currentProvinceId, levelId]);

  if (!mounted || !isVictory || typeof window === "undefined") {
    return null;
  }

  // Captured suspect
  const capturedSuspect = suspects.find((s) => s.id === warrantSuspectId) ?? null;

  // Stats calculation
  const initialTime = session?.initialTime ?? 35;
  const currentTime = session?.currentTime ?? 10;
  const hoursTaken = Math.max(1, initialTime - currentTime);
  const remainingPI = session?.currentPI ?? 0;
  const score =
    session?.score ??
    Math.max(1000, currentTime * 120 + remainingPI * 15);
  const rank = getDetectiveRank(hoursTaken, initialTime, remainingPI, score);

  const handleBackToPrincipal = () => {
    useGameSessionStore.getState().resetSession();
    clearAllBriefingSeenFlags();
    router.push("/principal");
  };

  return createPortal(
    <CronicaVictoryNewspaper
      levelId={levelId}
      suspect={capturedSuspect}
      provinceName={provinceName}
      score={score}
      hoursTaken={hoursTaken}
      remainingPI={remainingPI}
      rank={rank}
      onClose={handleBackToPrincipal}
    />,
    document.body
  );
}
