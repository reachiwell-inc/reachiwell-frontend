"use client";

import React from "react";

type Props = {
  className?: string;
  dotClassName?: string;
  ariaLabel?: string;
};

export default function TypingDots({
  className = "flex items-center gap-1.5 py-1",
  dotClassName = "w-2 h-2 rounded-full bg-[#0B2220]/60 animate-bounce",
  ariaLabel = "Waiting for response",
}: Props) {
  return (
    <div className={className} role="status" aria-label={ariaLabel}>
      <span className={dotClassName} style={{ animationDelay: "0ms" }} />
      <span className={dotClassName} style={{ animationDelay: "150ms" }} />
      <span className={dotClassName} style={{ animationDelay: "300ms" }} />
    </div>
  );
}

