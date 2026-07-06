"use client";

import { TaskPanel } from "@/components/TaskPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSectionMeta } from "@/lib/sections";
import type { Task } from "@/lib/types";

type TaskSectionProps = {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
};

export function TaskSection({ tasks, onChange }: TaskSectionProps) {
  const section = getSectionMeta("tasks");

  return (
    <section className="mx-auto max-w-5xl">
      <SectionHeader title={section.label} subtitle={section.subtitle} />
      <TaskPanel tasks={tasks} onChange={onChange} />
    </section>
  );
}
