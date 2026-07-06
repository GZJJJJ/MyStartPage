"use client";

import { DeadlinePanel } from "@/components/DeadlinePanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSectionMeta } from "@/lib/sections";
import type { Deadline } from "@/lib/types";

type DeadlineSectionProps = {
  deadlines: Deadline[];
  onChange: (deadlines: Deadline[]) => void;
};

export function DeadlineSection({ deadlines, onChange }: DeadlineSectionProps) {
  const section = getSectionMeta("deadlines");

  return (
    <section className="mx-auto max-w-5xl">
      <SectionHeader title={section.label} subtitle={section.subtitle} />
      <DeadlinePanel deadlines={deadlines} onChange={onChange} />
    </section>
  );
}
