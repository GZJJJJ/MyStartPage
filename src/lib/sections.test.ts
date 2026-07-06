import { describe, expect, it } from "vitest";
import { sections } from "./sections";

describe("app shell sections", () => {
  it("keeps the personal shell navigation focused on one active section", () => {
    expect(sections.map((section) => section.id)).toEqual([
      "home",
      "shortcuts",
      "tasks",
      "deadlines",
      "decision",
      "data",
    ]);
    expect(sections.map((section) => section.label)).toEqual([
      "首页",
      "快捷入口",
      "今日任务",
      "DDL",
      "随机决定",
      "数据工具",
    ]);
  });
});
