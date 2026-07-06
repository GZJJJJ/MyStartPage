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
    <header className="sticky top-0 z-20 mx-4 mt-4 rounded-[28px] border border-white/40 bg-white/24 px-4 py-3 shadow-[0_16px_50px_rgba(83,98,104,0.10)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/24 sm:mx-6 sm:mt-6 sm:px-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 xl:grid-cols-[minmax(13rem,auto)_minmax(20rem,1fr)_auto]">
        <div className="min-w-0">
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

        <form
          onSubmit={handleSubmit}
          className="col-span-2 grid min-w-0 grid-cols-[minmax(0,1fr)_2.75rem] gap-2 rounded-2xl border border-white/42 bg-white/24 p-1.5 dark:border-white/10 dark:bg-white/8 sm:grid-cols-[7.5rem_1fr_2.75rem] xl:col-span-1"
        >
          <label className="sr-only" htmlFor="status-search-engine">
            搜索引擎
          </label>
          <select
            id="status-search-engine"
            value={engine}
            onChange={(event) => onEngineChange(event.target.value as SearchEngineId)}
            className="h-10 min-w-0 rounded-xl border border-white/35 bg-white/34 px-3 text-sm text-[#334247] outline-none transition focus:border-[#93b8c2] focus:ring-2 focus:ring-[#93b8c2]/24 dark:border-white/10 dark:bg-slate-950/24 dark:text-[#e8edf2]"
          >
            {searchEngines.map((item) => (
              <option key={item} value={item}>
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
            className="col-span-2 row-start-2 h-10 min-w-0 rounded-xl border border-white/35 bg-white/34 px-3 text-sm text-[#334247] outline-none transition placeholder:text-[#8a948d] focus:border-[#93b8c2] focus:ring-2 focus:ring-[#93b8c2]/24 dark:border-white/10 dark:bg-slate-950/24 dark:text-[#e8edf2] dark:placeholder:text-[#9ca9b8] sm:col-span-1 sm:row-auto"
          />

          <button
            type="submit"
            className="col-start-2 row-start-1 grid h-10 place-items-center rounded-xl bg-[#93b8c2]/72 text-[#26393e] transition hover:bg-[#84aeb9]/82 focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24 dark:border dark:border-[#e5b84e]/24 dark:bg-[#e5b84e]/18 dark:text-[#f3d98a] dark:hover:bg-[#e5b84e]/24 sm:col-auto sm:row-auto"
            aria-label="搜索"
            title="搜索"
          >
            <Search size={17} />
          </button>
        </form>

        <button
          type="button"
          onClick={onToggleDarkMode}
          className="grid h-11 w-11 place-items-center justify-self-end rounded-full border border-white/42 bg-white/28 text-[#334247] transition hover:bg-white/42 focus:outline-none focus:ring-2 focus:ring-[#93b8c2]/24 dark:border-white/10 dark:bg-white/8 dark:text-[#e8edf2] dark:hover:bg-white/12"
          aria-label={darkMode ? "切换到浅色模式" : "切换到深色模式"}
          title={darkMode ? "浅色模式" : "深色模式"}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
    </header>
  );
}


