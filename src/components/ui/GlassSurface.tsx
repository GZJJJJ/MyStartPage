import type { ReactNode } from "react";

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function GlassSurface({ children, className = "" }: GlassSurfaceProps) {
  return (
    <div
      className={`rounded-[36px] border border-white/40 bg-white/22 shadow-[0_32px_90px_rgba(83,98,104,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/22 dark:shadow-[0_32px_90px_rgba(0,0,0,0.28)] ${className}`}
    >
      {children}
    </div>
  );
}
