import type { SearchEngineId } from "./types";

const SEARCH_URLS: Record<SearchEngineId, (query: string) => string> = {
  baidu: (query) => `https://www.baidu.com/s?wd=${query}`,
  google: (query) => `https://www.google.com/search?q=${query}`,
  github: (query) => `https://github.com/search?q=${query}`,
  bilibili: (query) => `https://search.bilibili.com/all?keyword=${query}`,
};

export const searchEngineLabels: Record<SearchEngineId, string> = {
  baidu: "百度",
  google: "Google",
  github: "GitHub",
  bilibili: "B站",
};

export function buildSearchUrl(engine: SearchEngineId, keyword: string): string {
  return SEARCH_URLS[engine](encodeURIComponent(keyword.trim()));
}
