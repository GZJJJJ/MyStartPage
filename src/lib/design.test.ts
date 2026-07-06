import { describe, expect, it } from "vitest";
import {
  dangerButtonClass,
  iconButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  softPanelClass,
} from "./design";

describe("design tokens", () => {
  it("uses glass panels suited to a single-section art shell", () => {
    expect(softPanelClass).toContain("rounded-[36px]");
    expect(softPanelClass).toContain("bg-white/22");
    expect(softPanelClass).toContain("backdrop-blur-2xl");
    expect(softPanelClass).toContain("dark:bg-slate-950/22");
  });

  it("uses Monet and Starry Night button colors instead of emerald dashboard buttons", () => {
    const buttonClasses = [
      primaryButtonClass,
      secondaryButtonClass,
      iconButtonClass,
      dangerButtonClass,
      inputClass,
    ].join(" ");

    expect(primaryButtonClass).toContain("bg-[#93b8c2]/72");
    expect(primaryButtonClass).toContain("dark:bg-[#e5b84e]/18");
    expect(primaryButtonClass).toContain("dark:text-[#f3d98a]");
    expect(buttonClasses).not.toContain("emerald");
  });
});
