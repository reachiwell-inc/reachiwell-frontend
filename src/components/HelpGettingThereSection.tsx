"use client";

import React from "react";
import HelpGettingThereOptions, { type HelpGettingThereAction } from "@/components/HelpGettingThereOptions";

export default function HelpGettingThereSection({
  onSelect,
  title = "Would you like help getting there?",
}: {
  title?: string;
  onSelect?: (action: HelpGettingThereAction) => void;
}) {
  return (
    <div className="mt-6">
      <HelpGettingThereOptions title={title} onSelect={onSelect} />
    </div>
  );
}

