import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { panelSubtitleClass, panelTitleClass, softPanelClass } from "@/lib/design";

type PanelProps = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, subtitle, icon: Icon, action, children, className = "" }: PanelProps) {
  return (
    <section className={`${softPanelClass} ${className}`}>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {Icon ? <Icon className="h-4 w-4 text-[#6f969b] dark:text-[#9bb8bd]" /> : null}
            <h2 className={panelTitleClass}>{title}</h2>
          </div>
          {subtitle ? <p className={panelSubtitleClass}>{subtitle}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
