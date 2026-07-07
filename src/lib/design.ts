export const liquidGlassChromeClass = [
  "border border-white/[0.34] bg-white/[0.20]",
  "shadow-[0_20px_70px_rgba(70,85,90,0.16),inset_0_1px_1px_rgba(255,255,255,0.32)]",
  "backdrop-blur-[36px]",
  "dark:border-white/[0.10] dark:bg-slate-950/[0.32]",
  "dark:shadow-[0_20px_70px_rgba(0,0,0,0.36),inset_0_1px_1px_rgba(255,255,255,0.12)]",
].join(" ");

export const liquidGlassControlClass = [
  "border border-white/[0.30] bg-[#fff8ee]/[0.20]",
  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.26),0_8px_26px_rgba(70,85,90,0.10)]",
  "backdrop-blur-[30px]",
  "dark:border-white/[0.10] dark:bg-[#07111f]/[0.36]",
  "dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.10),0_8px_26px_rgba(0,0,0,0.28)]",
].join(" ");

export const liquidGlassSurfaceClass = [
  "border border-white/[0.32] bg-white/[0.18]",
  "shadow-[0_24px_80px_rgba(70,85,90,0.16),inset_0_1px_1px_rgba(255,255,255,0.22)]",
  "backdrop-blur-[34px]",
  "dark:border-white/[0.10] dark:bg-slate-950/[0.28]",
  "dark:shadow-[0_24px_80px_rgba(0,0,0,0.34),inset_0_1px_1px_rgba(255,255,255,0.10)]",
].join(" ");

export const glassSurfaceClass = [
  "rounded-[28px]",
  liquidGlassSurfaceClass,
].join(" ");

export const softPanelClass = [
  "group p-6 transition-all duration-200 ease-out",
  glassSurfaceClass,
  "hover:bg-white/[0.24]",
  "focus-within:bg-white/[0.24] focus-within:border-white/50",
  "dark:hover:bg-slate-950/30 dark:focus-within:bg-slate-950/30",
].join(" ");

export const panelTitleClass = "text-base font-medium text-[#334247] dark:text-[#e8edf2]";

export const panelSubtitleClass = "mt-1 text-sm text-[#75847c] dark:text-[#9ca9b8]";

export const primaryButtonClass = [
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent",
  "bg-[#93b8c2]/[0.72] px-4 py-2.5 text-sm font-medium text-[#26393e]",
  "transition hover:bg-[#84aeb9]/[0.82] focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/28",
  "dark:border-[#e5b84e]/[0.24] dark:bg-[#e5b84e]/[0.18] dark:text-[#f3d98a] dark:hover:bg-[#e5b84e]/24",
].join(" ");

export const secondaryButtonClass = [
  "inline-flex items-center justify-center gap-2 rounded-2xl",
  "border border-white/42 bg-white/[0.28] px-4 py-2.5 text-sm font-medium text-[#334247]",
  "transition hover:bg-white/42 focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24",
  "dark:border-white/10 dark:bg-white/8 dark:text-[#e8edf2] dark:hover:bg-white/12",
].join(" ");

export const iconButtonClass = [
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/32",
  "bg-white/[0.24] text-[#64736d] transition hover:bg-white/42",
  "focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24",
  "dark:border-white/10 dark:bg-white/8 dark:text-[#c8d3dc] dark:hover:bg-white/12",
].join(" ");

export const dangerButtonClass = [
  "inline-flex h-8 w-8 items-center justify-center rounded-full",
  "text-[#75847c] transition hover:bg-rose-100/45 hover:text-rose-700",
  "focus:outline-none focus:ring-2 focus:ring-rose-200/50",
  "dark:text-[#9ca9b8] dark:hover:bg-rose-950/30 dark:hover:text-rose-300",
].join(" ");

export const inputClass = [
  "w-full appearance-none rounded-2xl border border-white/35 bg-[#fff8ee]/[0.24] px-4 py-3 shadow-none",
  "text-[#344046] placeholder:text-[#6f7e79]/60 outline-none transition-colors",
  "focus:border-[#93b8c2]/70 focus:ring-2 focus:ring-[#93b8c2]/20",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "dark:border-white/10 dark:bg-[#07111f]/[0.42] dark:text-[#e8edf2] dark:placeholder:text-slate-400/60",
  "dark:focus:border-[#e5b84e]/40 dark:focus:ring-[#e5b84e]/15",
].join(" ");

export const tileClass = [
  "rounded-[24px]",
  liquidGlassControlClass,
  "transition-all duration-200 hover:bg-white/[0.26]",
  "dark:hover:bg-white/[0.08]",
].join(" ");
