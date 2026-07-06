"use client";

import { DataTools } from "@/components/DataTools";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getSectionMeta } from "@/lib/sections";
import type { CloudSyncControls } from "@/lib/useCloudSync";
import type { DashboardData } from "@/lib/types";

type DataSectionProps = {
  data: DashboardData;
  cloudSync: CloudSyncControls;
  onImport: (data: DashboardData) => void;
};

export function DataSection({ data, cloudSync, onImport }: DataSectionProps) {
  const section = getSectionMeta("data");
  const stats = [
    { label: "快捷入口", value: data.shortcuts.length },
    { label: "任务", value: data.tasks.length },
    { label: "DDL", value: data.deadlines.length },
    { label: "已完成", value: data.tasks.filter((task) => task.completed).length },
  ];

  return (
    <section className="mx-auto max-w-5xl">
      <SectionHeader title={section.label} subtitle={section.subtitle} />
      <div className="space-y-6">
        <GlassSurface className="grid gap-4 p-5 sm:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="min-w-0 rounded-[24px] border border-white/28 bg-white/16 px-4 py-3 dark:border-white/10 dark:bg-white/8">
              <p className="text-xs text-[#75847c] dark:text-[#9ca9b8]">{item.label}</p>
              <p className="time-display mt-1 text-2xl font-medium text-[#334247] dark:text-[#e8edf2]">{item.value}</p>
            </div>
          ))}
        </GlassSurface>
        <DataTools data={data} cloudSync={cloudSync} onImport={onImport} />
      </div>
    </section>
  );
}
