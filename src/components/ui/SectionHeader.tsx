import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle: string;
  action?: ReactNode;
};

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="break-words text-4xl font-medium leading-tight tracking-wide text-[#334247] dark:text-[#e8edf2] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-[#75847c] dark:text-[#9ca9b8]">{subtitle}</p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
