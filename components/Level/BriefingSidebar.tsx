import BriefingClueCard from "./BriefingClueCard";
import { useT } from "@/hooks/useT";
import { defineMessages } from "@/lib/i18n/messages";
import styles from "./caseBriefing.module.css";

const messages = defineMessages({
  es: {
    resources: "Recursos asignados",
    hours: "{n} horas",
    pi: "{n} PI",
    clues: "Pistas del informe",
    clue: "Pista #{n}",
    pending: "Las pistas se clavan al terminar el informe…",
  },
  en: {
    resources: "Assigned resources",
    hours: "{n} hours",
    pi: "{n} IP",
    clues: "Report clues",
    clue: "Clue #{n}",
    pending: "Clues get pinned once the report is done…",
  },
});

type Props = { hours: number; pi: number; clues: string[]; revealed: boolean };

// Columna de la pizarra junto al informe: nota adhesiva con los recursos y las pistas iniciales clavadas,
// que aparecen una por una cuando termina de escribirse el informe
export default function BriefingSidebar({ hours, pi, clues, revealed }: Props) {
  const t = useT(messages);

  return (
    <div className="flex flex-col gap-5">
      {/* Nota adhesiva con los recursos */}
      {(hours > 0 || pi > 0) && (
        <div className={`relative self-start rotate-[2deg] bg-[#ffe873] px-4 pt-5 pb-4 text-zinc-900 shadow-[0_10px_20px_rgba(0,0,0,0.55)] ${styles.pinIn}`}>
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 w-14 rotate-[-3deg] bg-[#f3ead2]/80 shadow-sm" aria-hidden />
          <p className="font-mono text-[10px] lg:text-xs font-bold uppercase tracking-wider text-zinc-700">{t("resources")}</p>
          <p className={`mt-1 text-lg lg:text-xl font-bold ${styles.typewriter}`}>⏳ {t("hours", { n: hours })}</p>
          <p className={`text-lg lg:text-xl font-bold ${styles.typewriter}`}>🔍 {t("pi", { n: pi })}</p>
        </div>
      )}

      {/* Pistas iniciales */}
      {clues.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="inline-flex self-start items-center gap-2 rounded-lg border border-[rgba(255,243,199,0.18)] bg-[rgba(15,23,42,0.85)] px-3 py-1.5 font-mono text-[10px] lg:text-xs font-bold uppercase tracking-wider text-[#E1C380]">
            📍 {t("clues")}
          </p>
          {revealed ? (
            <ol className="flex flex-col gap-3">
              {clues.map((c, i) => (
                <BriefingClueCard key={c} label={t("clue", { n: i + 1 })} text={c} order={i} />
              ))}
            </ol>
          ) : (
            <p className={`font-mono text-[10px] lg:text-xs italic text-[#E1C380]/60 ${styles.hint}`}>{t("pending")}</p>
          )}
        </div>
      )}
    </div>
  );
}
