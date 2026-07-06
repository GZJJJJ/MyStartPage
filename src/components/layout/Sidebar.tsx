"use client";

import type { LucideIcon } from "lucide-react";
import { CalendarClock, CheckCircle, Compass, Database, Dices, Home, Sparkles } from "lucide-react";
import { sections, type SectionId } from "@/lib/sections";

type SidebarProps = {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
};

const sectionIcons: Record<SectionId, LucideIcon> = {
  home: Home,
  shortcuts: Compass,
  tasks: CheckCircle,
  deadlines: CalendarClock,
  decision: Dices,
  data: Database,
};

function navButtonClass(active: boolean): string {
  return [
    "relative flex h-12 w-full items-center rounded-2xl px-2 text-left transition duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24",
    active
      ? "bg-white/34 text-[#26393e] dark:bg-white/10 dark:text-[#f3d98a]"
      : "text-[#64736d] hover:bg-white/[0.24] hover:text-[#334247] dark:text-[#b9c5cf] dark:hover:bg-white/8 dark:hover:text-[#e8edf2]",
  ].join(" ");
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <>
      <aside className="group/sidebar fixed left-0 top-0 z-50 hidden h-screen w-16 border-r border-white/30 bg-white/[0.22] px-2 py-6 backdrop-blur-2xl transition-[width] duration-300 ease-out hover:w-56 dark:border-white/10 dark:bg-slate-950/[0.24] sm:block">
        <div className="mb-8 flex h-12 items-center rounded-2xl px-2 text-[#334247] dark:text-[#e8edf2]">
          <span className="grid h-10 w-10 flex-none place-items-center rounded-2xl bg-white/[0.30] dark:bg-white/8">
            <Sparkles size={19} />
          </span>
          <span className="sidebar-logo ml-3 whitespace-nowrap text-lg opacity-0 transition duration-200 translate-x-2 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
            Joe Space
          </span>
        </div>

        <nav className="space-y-2" aria-label="主栏目">
          {sections.map((section) => {
            const Icon = sectionIcons[section.id];
            const active = section.id === activeSection;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => onSectionChange(section.id)}
                className={navButtonClass(active)}
                aria-label={section.label}
                aria-current={active ? "page" : undefined}
                title={section.label}
              >
                {active ? <span className="absolute left-0 h-6 w-1 rounded-r-full bg-[#93b8c2] dark:bg-[#e5b84e]" /> : null}
                <span className="grid h-10 w-10 flex-none place-items-center">
                  <Icon size={19} />
                </span>
                <span className="ml-3 whitespace-nowrap text-sm opacity-0 transition duration-200 translate-x-2 group-hover/sidebar:translate-x-0 group-hover/sidebar:opacity-100">
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-6 rounded-[26px] border border-white/30 bg-white/[0.28] p-2 shadow-[0_16px_50px_rgba(83,98,104,0.16)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/[0.28] sm:hidden" aria-label="移动端栏目">
        {sections.map((section) => {
          const Icon = sectionIcons[section.id];
          const active = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSectionChange(section.id)}
              className={`relative grid h-11 place-items-center rounded-2xl transition focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24 ${
                active
                  ? "bg-white/42 text-[#26393e] dark:bg-white/12 dark:text-[#f3d98a]"
                  : "text-[#64736d] dark:text-[#b9c5cf]"
              }`}
              aria-label={section.label}
              aria-current={active ? "page" : undefined}
              title={section.label}
            >
              <Icon size={18} />
            </button>
          );
        })}
      </nav>
    </>
  );
}
