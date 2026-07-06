"use client";

import { FormEvent, useEffect, useState } from "react";
import { Moon, Search, Sun } from "lucide-react";
import { buildSearchUrl, searchEngineLabels } from "@/lib/search";
import { getSectionMeta, type SectionId } from "@/lib/sections";
import type { SearchEngineId } from "@/lib/types";

type TopStatusBarProps = {
  activeSection: SectionId;
  darkMode: boolean;
  engine: SearchEngineId;
  onEngineChange: (engine: SearchEngineId) => void;
  onToggleDarkMode: () => void;
};

const searchEngines = Object.keys(searchEngineLabels) as SearchEngineId[];

const searchShellClass = [
  "order-3 col-span-2 flex min-w-0 flex-1 items-center gap-2 rounded-2xl",
  "border border-white/30 bg-[#fff8ee]/[0.24] px-3 py-2 dark:border-white/10 dark:bg-[#07111f]/[0.42]",
  "backdrop-blur-xl transition-colors",
  "xl:order-none xl:col-span-1",
].join(" ");

const searchInputClass = [
  "min-w-0 flex-1 appearance-none border-0 bg-transparent px-1 text-sm shadow-none outline-none",
  "text-[#344046] dark:text-[#e8edf2]",
  "placeholder:text-[#6f7e79]/60 dark:placeholder:text-slate-400/60",
  "focus:border-0 focus:ring-0",
].join(" ");

const searchSelectClass = [
  "h-10 w-[6.6rem] shrink-0 appearance-none rounded-xl border border-white/25 bg-[#fff8ee]/[0.24] shadow-none dark:border-white/10 dark:bg-[#07111f]/[0.42]",
  "px-3 py-2 text-sm text-[#344046] dark:text-[#e8edf2]",
  "outline-none transition focus:border-[#93b8c2]/70 focus:ring-2 focus:ring-[#93b8c2]/20",
  "dark:focus:border-[#e5b84e]/40 dark:focus:ring-[#e5b84e]/15",
].join(" ");

const searchButtonClass = [
  "grid h-10 w-10 shrink-0 place-items-center rounded-2xl",
  "bg-[#93b8c2]/[0.70] text-[#26393e] transition-colors hover:bg-[#84aeb9]/[0.82]",
  "focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24",
  "dark:border dark:border-[#e5b84e]/[0.24] dark:bg-[#e5b84e]/[0.18] dark:text-[#f3d98a] dark:hover:bg-[#e5b84e]/[0.24]",
].join(" ");

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  weekday: "long",
});

const timeFormatter = new Intl.DateTimeFormat("zh-CN", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export function TopStatusBar({
  activeSection,
  darkMode,
  engine,
  onEngineChange,
  onToggleDarkMode,
}: TopStatusBarProps) {
  const [now, setNow] = useState(() => new Date());
  const [keyword, setKeyword] = useState("");
  const section = getSectionMeta(activeSection);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = keyword.trim();

    if (!query) {
      return;
    }

    window.location.href = buildSearchUrl(engine, query);
  }

  return (
    <header className="fixed left-4 right-4 top-4 z-40 rounded-[28px] border border-white/30 bg-white/[0.18] px-4 py-3 shadow-[0_20px_60px_rgba(70,85,90,0.12)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/[0.28] dark:shadow-[0_20px_60px_rgba(0,0,0,0.32)] sm:left-20 sm:right-6 sm:top-5 sm:px-5 sm:py-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 xl:grid-cols-[minmax(13rem,auto)_minmax(20rem,1fr)_auto]">
        <div className="order-1 min-w-0 xl:order-none">
          <p className="truncate text-xs text-[#75847c] dark:text-[#9ca9b8]" suppressHydrationWarning>
            {dateFormatter.format(now)}
          </p>
          <div className="mt-1 flex min-w-0 items-baseline gap-3">
            <span className="time-display text-2xl font-medium leading-none text-[#334247] dark:text-[#e8edf2] sm:text-3xl" suppressHydrationWarning>
              {timeFormatter.format(now)}
            </span>
            <span className="truncate text-xs text-[#75847c] dark:text-[#9ca9b8]">{section.label}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={searchShellClass}>
          <label className="sr-only" htmlFor="status-search-engine">
            搜索引擎
          </label>
          <select
            id="status-search-engine"
            value={engine}
            onChange={(event) => onEngineChange(event.target.value as SearchEngineId)}
            className={searchSelectClass}
          >
            {searchEngines.map((item) => (
              <option key={item} value={item} className="bg-[#f7efe4] text-[#344046] dark:bg-[#07111f] dark:text-[#e8edf2]">
                {searchEngineLabels[item]}
              </option>
            ))}
          </select>

          <label className="sr-only" htmlFor="status-search-keyword">
            搜索关键词
          </label>
          <input
            id="status-search-keyword"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="输入关键词后回车"
            className={searchInputClass}
          />

          <button type="submit" className={searchButtonClass} aria-label="搜索" title="搜索">
            <Search size={17} />
          </button>
        </form>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="order-2 grid h-11 w-11 place-items-center justify-self-end rounded-full border border-white/35 bg-white/[0.22] text-[#334247] transition hover:bg-white/[0.30] focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24 dark:border-white/10 dark:bg-white/8 dark:text-[#e8edf2] dark:hover:bg-white/12 xl:order-none"
          aria-label={darkMode ? "切换到浅色模式" : "切换到深色模式"}
          title={darkMode ? "浅色模式" : "深色模式"}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}
