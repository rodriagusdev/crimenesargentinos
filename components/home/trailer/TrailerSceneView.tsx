"use client";

import { memo, useEffect, useState } from "react";
import { ACTIVE_AFTER_MS, TRAILER_SCENES } from "./trailerScenes";
import { trailerScreenMessages } from "./TrailerScreen.messages";
import { useT } from "@/hooks/useT";

// Una escena del tráiler. Se monta con `key` por escena: arranca inactiva y se activa un instante después; sus
// animaciones son CSS, así que no depende del reloj del tráiler (no se vuelve a renderizar en cada tick).
function TrailerSceneView({ scene }: { scene: number }) {
  const t = useT(trailerScreenMessages);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setActive(true), ACTIVE_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return <>{TRAILER_SCENES[scene].render(active, t)}</>;
}

export default memo(TrailerSceneView);
