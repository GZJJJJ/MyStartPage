"use client";

import { DataSection } from "@/components/sections/DataSection";
import { DeadlineSection } from "@/components/sections/DeadlineSection";
import { DecisionSection } from "@/components/sections/DecisionSection";
import { HomeSection } from "@/components/sections/HomeSection";
import { ShortcutSection } from "@/components/sections/ShortcutSection";
import { TaskSection } from "@/components/sections/TaskSection";
import type { SectionId } from "@/lib/sections";
import type { CloudSyncControls } from "@/lib/useCloudSync";
import type { DashboardData, Deadline, Shortcut, Task } from "@/lib/types";

type ContentStageProps = {
  activeSection: SectionId;
  data: DashboardData;
  cloudSync: CloudSyncControls;
  onSectionChange: (section: SectionId) => void;
  onShortcutsChange: (shortcuts: Shortcut[]) => void;
  onTasksChange: (tasks: Task[]) => void;
  onDeadlinesChange: (deadlines: Deadline[]) => void;
  onDecisionChange: (options: string) => void;
  onImport: (data: DashboardData) => void;
};

export function ContentStage({
  activeSection,
  data,
  cloudSync,
  onSectionChange,
  onShortcutsChange,
  onTasksChange,
  onDeadlinesChange,
  onDecisionChange,
  onImport,
}: ContentStageProps) {
  return (
    <main className="px-4 py-8 sm:px-8 lg:px-12 lg:py-10">
      <div key={activeSection} className="stage-enter mx-auto max-w-6xl">
        {activeSection === "home" ? <HomeSection data={data} onNavigate={onSectionChange} /> : null}
        {activeSection === "shortcuts" ? (
          <ShortcutSection shortcuts={data.shortcuts} onChange={onShortcutsChange} />
        ) : null}
        {activeSection === "tasks" ? <TaskSection tasks={data.tasks} onChange={onTasksChange} /> : null}
        {activeSection === "deadlines" ? (
          <DeadlineSection deadlines={data.deadlines} onChange={onDeadlinesChange} />
        ) : null}
        {activeSection === "decision" ? (
          <DecisionSection options={data.decisionOptions} onChange={onDecisionChange} />
        ) : null}
        {activeSection === "data" ? <DataSection data={data} cloudSync={cloudSync} onImport={onImport} /> : null}
      </div>
    </main>
  );
}
