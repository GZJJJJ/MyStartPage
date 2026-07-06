import type { ReactNode } from "react";
import { glassSurfaceClass } from "@/lib/design";

type GlassSurfaceProps = {
  children: ReactNode;
  className?: string;
};

export function GlassSurface({ children, className = "" }: GlassSurfaceProps) {
  return <div className={`${glassSurfaceClass} ${className}`}>{children}</div>;
}