"use client";

import { ArrowRight, CalendarClock, CheckCircle, Compass } from "lucide-react";
import { GlassSurface } from "@/components/ui/GlassSurface";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getDaysRemaining, sortDeadlines } from "@/lib/date";
import { primaryButtonClass, secondaryButtonClass } from "@/lib/design";
import type { SectionId } from "@/lib/sections";
import type { DashboardData } from "@/lib/types";

type HomeSectionProps = {
  data: DashboardData;
  onNavigate: (section: SectionId) => void;
};

function getDeadlineText(days: number): string {
  if (days === 0) {
    return "今天";
  }

  if (days > 0) {
    return `D-${days}`;
  }

  return `已过 ${Math.abs(days)} 天`;
}

export function HomeSection({ data, onNavigate }: HomeSectionProps) {
  const pendingTasks = data.tasks.filter((task) => !task.completed);
  const completedTasks = data.tasks.length - pendingTasks.length;
  const upcomingDeadlines = sortDeadlines(data.deadlines).slice(0, 3);

  return (
    <section className="mx-auto max-w-5xl">
      <SectionHeader title="首页" subtitle="像打开一套安静的个人桌面，只留下今天需要进入的窗口。" />

      <GlassSurface className="p-7 sm:p-9">
        <div className="grid gap-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="section-title-en text-sm uppercase text-[#75847c] dark:text-[#9ca9b8]">Joe Space</p>
            <h2 className="mt-3 max-w-xl text-2xl font-medium leading-tight text-[#334247] dark:text-[#e8edf2] sm:text-4xl">
              今天只打开一个窗口。
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#65736c] dark:text-[#b8c4ce]">
              搜索在状态栏，常用入口、任务、DDL 和数据工具都收进左侧栏目。首页只做轻量提示，不再承担 dashboard。
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button type="button" onClick={() => onNavigate("shortcuts")} className={primaryButtonClass}>
                <Compass size={17} />
                进入快捷入口
              </button>
              <button type="button" onClick={() => onNavigate("tasks")} className={secondaryButtonClass}>
                <CheckCircle size={17} />
                查看今日任务
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[28px] border border-white/34 bg-white/18 p-5 dark:border-white/10 dark:bg-white/8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#334247] dark:text-[#e8edf2]">今日任务</p>
                  <p className="mt-1 text-xs text-[#75847c] dark:text-[#9ca9b8]">
                    已完成 {completedTasks}/{data.tasks.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate("tasks")}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/28 text-[#334247] transition hover:bg-white/42 dark:bg-white/8 dark:text-[#e8edf2] dark:hover:bg-white/12"
                  aria-label="打开今日任务"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="mt-4 space-y-2">
                {pendingTasks.slice(0, 3).map((task) => (
                  <p key={task.id} className="truncate text-sm text-[#53625b] dark:text-[#c7d0d8]">
                    {task.text}
                  </p>
                ))}
                {pendingTasks.length === 0 ? (
                  <p className="text-sm text-[#75847c] dark:text-[#9ca9b8]">今天没有未完成任务。</p>
                ) : null}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/34 bg-white/18 p-5 dark:border-white/10 dark:bg-white/8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#334247] dark:text-[#e8edf2]">最近 DDL</p>
                  <p className="mt-1 text-xs text-[#75847c] dark:text-[#9ca9b8]">按剩余时间排序</p>
                </div>
                <CalendarClock size={18} className="text-[#93b8c2] dark:text-[#e5b84e]" />
              </div>
              <div className="mt-4 space-y-3">
                {upcomingDeadlines.map((deadline) => {
                  const days = getDaysRemaining(deadline.date);

                  return (
                    <button
                      key={deadline.id}
                      type="button"
                      onClick={() => onNavigate("deadlines")}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-3 py-2 text-left transition hover:bg-white/24 dark:hover:bg-white/8"
                    >
                      <span className="min-w-0 truncate text-sm text-[#53625b] dark:text-[#c7d0d8]">{deadline.title}</span>
                      <span className="shrink-0 rounded-full bg-white/28 px-3 py-1 text-xs text-[#4f7076] dark:bg-white/8 dark:text-[#f3d98a]">
                        {getDeadlineText(days)}
                      </span>
                    </button>
                  );
                })}
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-[#75847c] dark:text-[#9ca9b8]">暂无 DDL。</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </GlassSurface>
    </section>
  );
}
