import Image from "next/image";
import type { CaseStory } from "@/lib/caseStories";

// Miniatura de una tapa en la tira de la hemeroteca
export default function FrontPageThumb({ story, active, onSelect }: { story: CaseStory; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Tapa del caso ${story.level}: ${story.headline}`}
      aria-current={active ? "true" : undefined}
      className={`flex flex-col gap-0.5 bg-[#ece2c9] p-1 text-[#1b1813] text-left transition duration-200 cursor-pointer hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E1C380] ${
        active ? "-translate-y-1 ring-2 ring-[#E1C380] shadow-[0_0_18px_rgba(225,195,128,0.5)]" : "opacity-70 hover:opacity-100 sepia-[0.4]"
      }`}
    >
      <span className="border-b-2 border-double border-[#1b1813] text-center font-serif font-black text-[7px] sm:text-[9px] leading-tight">
        El Vespertino
      </span>
      <span className="font-serif font-black uppercase text-[6px] sm:text-[7px] leading-tight line-clamp-2 min-h-[2lh]">{story.headline}</span>
      <span className="relative block aspect-[4/3] overflow-hidden">
        <Image src={story.image} alt="" fill sizes="96px" className="object-cover grayscale contrast-125" />
      </span>
      <span className="text-center font-mono text-[8px]">N° {story.level}</span>
    </button>
  );
}
