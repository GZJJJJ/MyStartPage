import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { TopStatusBar } from "./TopStatusBar";

describe("TopStatusBar search styles", () => {
  it("stays fixed above the content with adaptive translucent search controls", () => {
    const html = renderToStaticMarkup(
      <TopStatusBar
        activeSection="home"
        darkMode={false}
        engine="baidu"
        onEngineChange={vi.fn()}
        onToggleDarkMode={vi.fn()}
      />,
    );

    expect(html).toContain("fixed");
    expect(html).toContain("z-40");
    expect(html).toContain("sm:left-20");
    expect(html).toContain("bg-white/[0.18]");
    expect(html).toContain("dark:bg-slate-950/[0.28]");
    expect(html).toContain("bg-[#fff8ee]/[0.24]");
    expect(html).toContain("dark:bg-[#07111f]/[0.42]");
    expect(html).toContain("border-0");
    expect(html).toContain("shadow-none");
    expect(html).toContain("bg-transparent");
    expect(html).toContain("placeholder:text-[#6f7e79]/60 dark:placeholder:text-slate-400/60");
    expect(html).toContain("bg-[#fff8ee]/[0.24]");
    expect(html).toContain("dark:bg-[#07111f]/[0.42]");
    expect(html).toContain("bg-[#f7efe4] text-[#344046] dark:bg-[#07111f] dark:text-[#e8edf2]");
    expect(html).toContain("bg-[#93b8c2]/[0.70]");
    expect(html).toContain("dark:bg-[#e5b84e]/[0.18]");
    expect(html).not.toContain("bg-white/18");
    expect(html).not.toContain("bg-[#fff8ee]/24");
    expect(html).not.toContain("dark:bg-[#07111f]/42");
    expect(html).not.toContain("bg-white/34");
  });
});
