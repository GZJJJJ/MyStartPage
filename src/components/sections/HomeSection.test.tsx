import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createDefaultData } from "@/lib/storage";
import { HomeSection } from "./HomeSection";

describe("HomeSection copy", () => {
  it("uses natural start page copy instead of layout explanations", () => {
    const html = renderToStaticMarkup(<HomeSection data={createDefaultData()} onNavigate={vi.fn()} />);

    expect(html).toContain("把今天要用的东西放在手边。");
    expect(html).toContain("今天先从一件小事开始。");
    expect(html).toContain("常用入口、任务和 DDL 都收好了。需要什么，就打开什么。");
    expect(html).not.toContain("都在左侧");
    expect(html).not.toContain("像打开一套安静的个人桌面");
    expect(html).not.toContain("首页只做轻量提示");
    expect(html).not.toContain("不再承担 dashboard");
  });
});
