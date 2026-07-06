import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./SectionHeader";

describe("SectionHeader", () => {
  it("renders only the Chinese title and natural subtitle", () => {
    const html = renderToStaticMarkup(<SectionHeader title="首页" subtitle="把今天要用的东西放在手边。" />);

    expect(html).toContain("首页");
    expect(html).toContain("把今天要用的东西放在手边。");
    expect(html).not.toContain("Personal Shell");
    expect(html).not.toContain("PERSONAL SHELL");
    expect(html).not.toContain("APP SHELL");
    expect(html).not.toContain("DASHBOARD");
    expect(html).not.toContain("WORKSPACE");
  });
});
