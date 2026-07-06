import { describe, expect, it } from "vitest";
import { buildSearchUrl } from "./search";

describe("buildSearchUrl", () => {
  it("builds Baidu search URLs", () => {
    expect(buildSearchUrl("baidu", "Next.js 首页")).toBe(
      "https://www.baidu.com/s?wd=Next.js%20%E9%A6%96%E9%A1%B5",
    );
  });

  it("builds Google search URLs", () => {
    expect(buildSearchUrl("google", "tailwind dashboard")).toBe(
      "https://www.google.com/search?q=tailwind%20dashboard",
    );
  });

  it("builds GitHub search URLs", () => {
    expect(buildSearchUrl("github", "next localStorage")).toBe(
      "https://github.com/search?q=next%20localStorage",
    );
  });

  it("builds Bilibili search URLs", () => {
    expect(buildSearchUrl("bilibili", "TypeScript 教程")).toBe(
      "https://search.bilibili.com/all?keyword=TypeScript%20%E6%95%99%E7%A8%8B",
    );
  });
});
