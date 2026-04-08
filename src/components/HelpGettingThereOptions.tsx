"use client";

import React from "react";

export type HelpGettingThereAction = "ride" | "directions" | "volunteer" | "self";

export default function HelpGettingThereOptions({
  title = "Would you like help getting there?",
  onSelect,
}: {
  title?: string;
  onSelect?: (action: HelpGettingThereAction) => void;
}) {
  const itemClass =
    "w-full bg-[#E0EEEC] text-[#545858] px-6 py-4 rounded-full text-base font-medium leading-[1.275] flex items-center gap-3 hover:bg-[#D0DEDC] transition-colors active:bg-[#C0CECC]";

  return (
    <div className="w-full">
      <div className="text-[#545858] text-base font-normal leading-[1.275] mt-8 mb-4">{title}</div>
      <div className="space-y-4">
        <button type="button" className={itemClass} onClick={() => onSelect?.("directions")}>
          <span className="text-xl" aria-hidden>
            🧭
          </span>
          <span>Help me with directions</span>
        </button>

        <button type="button" className={itemClass} onClick={() => onSelect?.("volunteer")}>
          <span className="text-xl" aria-hidden>
            👤
          </span>
          <span>Speak with a ReachiWell volunteer</span>
        </button>

        <button type="button" className={itemClass} onClick={() => onSelect?.("self")}>
          <span className="text-xl" aria-hidden>
            ❌
          </span>
          <span>No, I’ll get there myself</span>
        </button>
      </div>
    </div>
  );
}

