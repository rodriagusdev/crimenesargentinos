"use client";

import Image from "next/image";
import type { CaseStory } from "@/lib/caseStories";

// Cuadro de la tira de película del póster: el arte de un caso, apagado, con su número de expediente
export default function TrailerPosterFrame({ story }: { story: CaseStory }) {
  return (
    <div className="relative shrink-0 w-24 sm:w-32 aspect-[4/3] overflow-hidden rounded-[2px] bg-black">
      <Image src={story.image} alt="" fill sizes="128px" className="object-cover brightness-50 saturate-50" />
      <span className="absolute left-1 top-1 text-[7px] sm:text-[8px] text-[#E1C380]">{String(story.level).padStart(2, "0")}</span>
    </div>
  );
}
