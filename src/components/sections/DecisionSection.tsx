"use client";

import { DecisionPanel } from "@/components/DecisionPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSectionMeta } from "@/lib/sections";

type DecisionSectionProps = {
  options: string;
  onChange: (options: string) => void;
};

export function DecisionSection({ options, onChange }: DecisionSectionProps) {
  const section = getSectionMeta("decision");

  return (
    <section className="mx-auto max-w-5xl">
      <SectionHeader title={section.label} subtitle={section.subtitle} />
      <DecisionPanel options={options} onChange={onChange} />
    </section>
  );
}
