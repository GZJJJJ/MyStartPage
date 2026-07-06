export const softPanelClass = [
  "group rounded-[36px] border border-white/40 bg-white/22 p-6 shadow-[0_32px_90px_rgba(83,98,104,0.14)]",
  "backdrop-blur-2xl transition-all duration-200 ease-out",
  "hover:bg-white/28 hover:-translate-y-px",
  "focus-within:bg-white/28 focus-within:border-white/55",
  "dark:border-white/10 dark:bg-slate-950/22 dark:shadow-[0_32px_90px_rgba(0,0,0,0.28)]",
  "dark:hover:bg-slate-950/28 dark:focus-within:bg-slate-950/28",
].join(" ");

export const panelTitleClass = "text-base font-medium text-[#334247] dark:text-[#e8edf2]";

export const panelSubtitleClass = "mt-1 text-sm text-[#75847c] dark:text-[#9ca9b8]";

export const primaryButtonClass = [
  "inline-flex items-center justify-center gap-2 rounded-2xl border border-transparent",
  "bg-[#93b8c2]/72 px-4 py-2.5 text-sm font-medium text-[#26393e]",
  "transition hover:bg-[#84aeb9]/82 focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/28",
  "dark:border-[#e5b84e]/24 dark:bg-[#e5b84e]/18 dark:text-[#f3d98a] dark:hover:bg-[#e5b84e]/24",
].join(" ");

export const secondaryButtonClass = [
  "inline-flex items-center justify-center gap-2 rounded-2xl",
  "border border-white/42 bg-white/28 px-4 py-2.5 text-sm font-medium text-[#334247]",
  "transition hover:bg-white/42 focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24",
  "dark:border-white/10 dark:bg-white/8 dark:text-[#e8edf2] dark:hover:bg-white/12",
].join(" ");

export const iconButtonClass = [
  "inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/32",
  "bg-white/24 text-[#64736d] transition hover:bg-white/42",
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
  "rounded-2xl border border-white/42 bg-white/28",
  "text-[#334247] placeholder:text-[#8a948d]",
  "focus:border-[#93b8c2] focus:ring-2 focus:ring-[#93b8c2]/24",
  "dark:border-white/10 dark:bg-white/8 dark:text-[#e8edf2] dark:placeholder:text-[#9ca9b8]",
].join(" ");

export const tileClass = [
  "rounded-[24px] border border-white/34 bg-white/20",
  "transition-all duration-200 hover:-translate-y-px hover:bg-white/34",
  "dark:border-white/10 dark:bg-slate-950/18 dark:hover:bg-white/10",
].join(" ");
