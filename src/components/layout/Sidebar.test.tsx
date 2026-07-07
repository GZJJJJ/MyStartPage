import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar stacking", () => {
  it("keeps the GitHub sidebar layout with liquid glass chrome", () => {
    const html = renderToStaticMarkup(<Sidebar activeSection="home" onSectionChange={vi.fn()} />);

    expect(html).toContain("z-50 hidden h-screen");
    expect(html).toContain("hover:w-56");
    expect(html).toContain("bottom-3 z-30");
    expect(html).toContain("backdrop-blur-[36px]");
    expect(html).toContain("inset_0_1px_1px_rgba(255,255,255,0.32)");
    expect(html).not.toContain("backdrop-blur-2xl");
  });
});
