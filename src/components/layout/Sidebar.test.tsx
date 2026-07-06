import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar stacking", () => {
  it("keeps the expanded desktop sidebar above the fixed top status bar", () => {
    const html = renderToStaticMarkup(<Sidebar activeSection="home" onSectionChange={vi.fn()} />);

    expect(html).toContain("z-50 hidden h-screen");
    expect(html).toContain("hover:w-56");
    expect(html).toContain("bottom-3 z-30");
  });
});
