"use client";

import Link from "next/link";
import { createContext, ReactNode, useContext } from "react";
import type { MessageVars } from "@/lib/i18n/messages";
import { BookletCard, PolaroidCard, Rich, VintageCallout, VintageTable } from "./RulesBookParts";
import type { RulesBookMessageKey } from "./RulesBook.messages";

type T = (key: RulesBookMessageKey, vars?: MessageVars) => string;

// Prefijos de las tarjetas: cada uno tiene su "...Title" y su "...Body" en los mensajes
type CardKey = RulesBookMessageKey extends infer K ? (K extends `${infer P}Body` ? P : never) : never;

export interface SectionData {
  id: "objetivo" | "niveles" | "recursos" | "pistas" | "arresto" | "escondite" | "progreso";
  number: string;
  render: (t: T) => ReactNode;
}

// A dónde vuelve el manual: al login (se ve sin sesión) o a los casos si se abrió desde /principal
export type RulesReturnPath = "/login" | "/principal";
export const RulesReturnContext = createContext<RulesReturnPath>("/login");

const PHOTO_CLASS = "w-40 sm:w-44";

function Card({ t, k, num }: { t: T; k: CardKey; num?: string }) {
  return (
    <BookletCard num={num} title={t(`${k}Title` as RulesBookMessageKey)}>
      <Rich text={t(`${k}Body` as RulesBookMessageKey)} />
    </BookletCard>
  );
}

function Callout({ t, k, isDanger = false }: { t: T; k: "objetivo" | "niveles" | "recursos" | "pistas" | "arresto" | "escondite"; isDanger?: boolean }) {
  return (
    <VintageCallout label={t(`${k}CalloutLabel`)} isDanger={isDanger}>
      <Rich text={t(`${k}Callout`)} />
    </VintageCallout>
  );
}

// Columna de texto a la izquierda y polaroids a la derecha (ocultas en celular)
function WithPhotos({ children, photos, row = false }: { children: ReactNode; photos: ReactNode; row?: boolean }) {
  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <div className="flex-1 flex flex-col gap-3.5">{children}</div>
      <div className={`hidden md:flex ${row ? "flex-row lg:flex-col" : "flex-col"} gap-4 items-center justify-center shrink-0 w-full lg:w-48 pt-1`}>
        {photos}
      </div>
    </div>
  );
}

function ResourceBox({ icon, eyebrow, title, body }: { icon: string; eyebrow: string; title: string; body: string }) {
  return (
    <div className="flex-1 rounded border border-[#bfae91] bg-[#f5ecda] p-3 flex items-center gap-3 shadow-xs">
      <span className="shrink-0 text-xl sm:text-2xl p-1.5 sm:p-2 rounded bg-[#ede0c6] border border-[#cfbe9e]">{icon}</span>
      <div>
        <div className="text-[10px] font-mono text-[#665038] uppercase tracking-wider font-bold">{eyebrow}</div>
        <div className="text-sm font-serif font-bold text-[#2d2116]">{title}</div>
        <div className="text-xs text-[#52412e] font-serif">{body}</div>
      </div>
    </div>
  );
}

const Free = ({ t }: { t: T }) => <span className="text-[#1b6b3e] font-semibold">{t("costFree")}</span>;

// Caja final del manual: invita a ingresar o, si ya está jugando, a volver a sus casos
function ReturnDispatchBox({ t }: { t: T }) {
  const returnTo = useContext(RulesReturnContext);
  const inGame = returnTo === "/principal";

  return (
    <div className="mt-2 rounded border-2 border-[#9e835c] bg-gradient-to-r from-[#f0e6cf] via-[#f7f1e1] to-[#ede2ca] p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div className="font-serif font-bold text-xs sm:text-sm uppercase tracking-wider text-[#3d2e1c]">{t("dispatchTitle")}</div>
        <div className="text-xs sm:text-[13px] text-[#52412e] font-serif mt-1">{inGame ? t("dispatchInGame") : t("dispatchGuest")}</div>
      </div>
      <Link
        href={returnTo}
        className="shrink-0 w-full sm:w-auto text-center whitespace-nowrap rounded border-2 border-[#52412d] bg-[#3a2d1e] px-6 py-2.5 text-xs sm:text-sm font-serif font-bold tracking-wider text-[#f5ebd7] shadow-md hover:bg-[#271d12] hover:scale-105 active:scale-95 transition-all"
      >
        {inGame ? t("dispatchInGameButton") : t("dispatchGuestButton")}
      </Link>
    </div>
  );
}

export const SECTIONS: SectionData[] = [
  {
    id: "objetivo",
    number: "01",
    render: (t) => (
      <WithPhotos
        row
        photos={
          <>
            <PolaroidCard imageSrc="/images/suspects/level1/Cara_Gordo_Tragassi_Sospechoso.webp" caption={t("objetivoPhoto1Caption")} subCaption={t("objetivoPhoto1Sub")} rotation="rotate-[2deg]" stamp={t("objetivoPhoto1Stamp")} pinColor="red" className={PHOTO_CLASS} />
            <PolaroidCard imageSrc="/images/test_composite.webp" caption={t("objetivoPhoto2Caption")} subCaption={t("objetivoPhoto2Sub")} rotation="rotate-[-2deg]" pinColor="gold" className={PHOTO_CLASS} />
          </>
        }
      >
        <p className="text-xs sm:text-sm leading-relaxed text-[#2e2419] italic font-serif">{t("objetivoIntro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Card t={t} k="objetivoCard1" num="01" />
          <Card t={t} k="objetivoCard2" num="02" />
          <Card t={t} k="objetivoCard3" num="03" />
        </div>
        <Callout t={t} k="objetivo" isDanger />
      </WithPhotos>
    ),
  },
  {
    id: "niveles",
    number: "02",
    render: (t) => (
      <WithPhotos
        photos={<PolaroidCard imageSrc="/images/suspects/level1/Cara_Porcelana_Jr_Sospechoso.webp" caption={t("nivelesPhotoCaption")} subCaption={t("nivelesPhotoSub")} rotation="rotate-[-1.5deg]" stamp={t("nivelesPhotoStamp")} pinColor="gold" className={PHOTO_CLASS} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([1, 2, 3, 4] as const).map((n) => (
            <Card key={n} t={t} k={`nivelesCard${n}`} num={t("ruleNum", { n })} />
          ))}
        </div>
        <Callout t={t} k="niveles" />
      </WithPhotos>
    ),
  },
  {
    id: "recursos",
    number: "03",
    render: (t) => (
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row gap-3">
          <ResourceBox icon="⏳" eyebrow={t("timeEyebrow")} title={t("timeTitle")} body={t("timeBody")} />
          <ResourceBox icon="⭐" eyebrow={t("piEyebrow")} title={t("piTitle")} body={t("piBody")} />
        </div>
        <VintageTable
          head={[t("recursosHeadAction"), t("recursosHeadCost")]}
          rows={[
            [t("costProvince"), t("costProvinceValue")],
            [t("costLocation"), t("costLocationValue")],
            [t("costWitness"), t("costWitnessValue")],
            [<Rich key="a" text={t("costNewClue")} />, <Rich key="b" text={t("costNewClueValue")} />],
            [t("costRepeat"), <Free key="b" t={t} />],
            [t("costStay"), <Free key="b" t={t} />],
          ]}
        />
        <Callout t={t} k="recursos" isDanger />
      </div>
    ),
  },
  {
    id: "pistas",
    number: "04",
    render: (t) => (
      <WithPhotos
        photos={<PolaroidCard imageSrc="/images/dialogbackground/level2/Dialogo_gaucho.webp" caption={t("pistasPhotoCaption")} subCaption={t("pistasPhotoSub")} rotation="rotate-[1.5deg]" pinColor="red" className={PHOTO_CLASS} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([1, 2, 3, 4] as const).map((n) => (
            <Card key={n} t={t} k={`pistasCard${n}`} num={`0${n}`} />
          ))}
        </div>
        <Callout t={t} k="pistas" />
      </WithPhotos>
    ),
  },
  {
    id: "arresto",
    number: "05",
    render: (t) => (
      <WithPhotos
        photos={<PolaroidCard imageSrc="/images/suspects/level1/Cara_Sospechoso_Peque_Mafia.webp" caption={t("arrestoPhotoCaption")} subCaption={t("arrestoPhotoSub")} rotation="rotate-[-2deg]" stamp={t("arrestoPhotoStamp")} pinColor="gold" className={PHOTO_CLASS} />}
      >
        <p className="text-xs sm:text-sm text-[#2e2419] leading-relaxed font-serif">{t("arrestoIntro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([1, 2, 3] as const).map((n) => (
            <Card key={n} t={t} k={`arrestoCard${n}`} num={t("articleNum", { n })} />
          ))}
        </div>
        <Callout t={t} k="arresto" isDanger />
      </WithPhotos>
    ),
  },
  {
    id: "escondite",
    number: "06",
    render: (t) => (
      <div className="flex flex-col gap-3.5">
        <p className="text-xs sm:text-sm text-[#2e2419] leading-relaxed font-serif">{t("esconditeIntro")}</p>
        <VintageTable
          head={[t("esconditeHeadSituation"), t("esconditeHeadOutcome")]}
          rows={[
            [t("outcomeGuilty"), <Rich key="b" text={`++${t("outcomeGuiltyValue")}++`} />],
            [t("outcomeInnocent"), <Rich key="b" text={`!!${t("outcomeInnocentValue")}!!`} />],
            [t("outcomeNoWarrantFew"), <Rich key="b" text={`!!${t("outcomeNoWarrantFewValue")}!!`} />],
            [t("outcomeNoWarrantEnough"), <span key="b" className="text-[#a85e13] font-bold">{t("outcomeNoWarrantEnoughValue")}</span>],
          ]}
        />
        <Callout t={t} k="escondite" />
      </div>
    ),
  },
  {
    id: "progreso",
    number: "07",
    render: (t) => (
      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {([1, 2, 3] as const).map((n) => (
            <Card key={n} t={t} k={`progresoCard${n}`} num={t(`progresoCard${n}Num`)} />
          ))}
        </div>
        <ReturnDispatchBox t={t} />
      </div>
    ),
  },
];
