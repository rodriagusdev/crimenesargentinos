"use client";

import dynamic from "next/dynamic";
import { useCallback, useState, useSyncExternalStore } from "react";
import { clearSplashPending, getSplashRequest } from "@/lib/splashStorage";
import SplashCurtain from "./SplashCurtain";

// El shell y el splash elegido se descargan solo cuando hay que mostrar uno
const SplashShell = dynamic(() => import("./SplashShell"), { ssr: false, loading: () => <SplashCurtain /> });

const noopSubscribe = () => () => {};

// Muestra un splash al azar una sola vez, justo después del login (o el de `?splash=<id>` como vista previa)
export default function PostLoginSplash() {
  const request = useSyncExternalStore(noopSubscribe, getSplashRequest, () => null);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    clearSplashPending();
    setDone(true);
  }, []);

  if (!request || done) return null;
  return <SplashShell onFinish={finish} request={request} />;
}
