import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { inputClass } from "@/lib/design";
import { DecisionPanel } from "./DecisionPanel";

describe("DecisionPanel", () => {
  it("uses adaptive translucent textarea styles for decision options", () => {
    const html = renderToStaticMarkup(<DecisionPanel options={"写作业\n休息"} onChange={vi.fn()} />);

    expect(html).toContain(inputClass);
    expect(html).toContain("min-h-44");
    expect(html).toContain("resize-none");
    expect(html).not.toContain("bg-white/[0.28]");
  });
});
