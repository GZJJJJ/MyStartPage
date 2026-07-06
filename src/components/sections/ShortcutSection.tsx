"use client";

import { ShortcutPanel } from "@/components/ShortcutPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSectionMeta } from "@/lib/sections";
import type { Shortcut } from "@/lib/types";

type ShortcutSectionProps = {
  shortcuts: Shortcut[];
  onChange: (shortcuts: Shortcut[]) => void;
};

export function ShortcutSection({ shortcuts, onChange }: ShortcutSectionProps) {
  const section = getSectionMeta("shortcuts");

  return (
    <section className="mx-auto max-w-6xl">
      <SectionHeader title={section.label} subtitle={section.subtitle} />
      <ShortcutPanel shortcuts={shortcuts} onChange={onChange} />
    </section>
  );
}
