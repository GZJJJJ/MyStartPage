import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, subtitle, eyebrow = "Personal Shell", action }: SectionHeaderProps) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="section-title-en text-xs font-medium uppercase text-[#75847c] dark:text-[#9ca9b8]">{eyebrow}</p>
        <h1 className="mt-2 break-words text-3xl font-medium leading-tight text-[#334247] dark:text-[#e8edf2] sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#75847c] dark:text-[#9ca9b8]">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
