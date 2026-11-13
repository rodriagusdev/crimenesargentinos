import { defineMessages } from "@/lib/i18n/messages";

export const splashAtmosphereMessages = defineMessages({
  es: {
    captionUnknown: "N.N. #1",
    captionSeen: "VISTO 02:40 HS",
    captionNoAlibi: "SIN COARTADA",
    captionFugitive: "PRÓFUGO",
    clock: "BUENOS AIRES · 03:14 HS",
    camera: "CAM 04 REC",
  },
  en: {
    captionUnknown: "JOHN DOE #1",
    captionSeen: "SEEN 2:40 AM",
    captionNoAlibi: "NO ALIBI",
    captionFugitive: "AT LARGE",
    clock: "BUENOS AIRES · 3:14 AM",
    camera: "CAM 04 REC",
  },
});

export type SplashAtmosphereKey = keyof (typeof splashAtmosphereMessages)["es"];
