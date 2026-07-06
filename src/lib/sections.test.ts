import { describe, expect, it } from "vitest";
import { sections } from "./sections";

describe("app shell sections", () => {
  it("keeps navigation focused on one active section", () => {
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
    expect(sections.map((section) => section.subtitle)).toEqual([
      "把今天要用的东西放在手边。",
      "把常用网站收在一处。",
      "只看今天需要完成的事。",
      "重要日期放在这里，别等到最后一天。",
      "选择太多时，让它帮你推一下。",
      "备份、导入和同步你的启动页数据。",
    ]);
  });
});
