import { describe, expect, it } from "vitest";
import {
  dangerButtonClass,
  glassSurfaceClass,
  iconButtonClass,
  inputClass,
  liquidGlassChromeClass,
  liquidGlassControlClass,
  liquidGlassSurfaceClass,
  primaryButtonClass,
  secondaryButtonClass,
  softPanelClass,
  tileClass,
} from "./design";

describe("design tokens", () => {
  it("uses liquid glass tokens for chrome, controls, and module surfaces", () => {
    expect(liquidGlassChromeClass).toContain("backdrop-blur-[36px]");
    expect(liquidGlassChromeClass).toContain("inset_0_1px_1px_rgba(255,255,255,0.32)");
    expect(liquidGlassControlClass).toContain("backdrop-blur-[30px]");
    expect(liquidGlassControlClass).toContain("inset_0_1px_1px_rgba(255,255,255,0.26)");
    expect(liquidGlassSurfaceClass).toContain("backdrop-blur-[34px]");
    expect(liquidGlassSurfaceClass).toContain("inset_0_1px_1px_rgba(255,255,255,0.22)");

    expect(glassSurfaceClass).toContain("rounded-[28px]");
    expect(glassSurfaceClass).toContain(liquidGlassSurfaceClass);
    expect(softPanelClass).toContain(glassSurfaceClass);
    expect(softPanelClass).not.toContain("backdrop-blur-2xl");
  });

  it("keeps card hover states static without lift animation", () => {
    expect(softPanelClass).not.toContain("hover:-translate-y-px");
    expect(tileClass).not.toContain("hover:-translate-y-px");
  });

  it("uses Monet and Starry Night button colors instead of emerald dashboard buttons", () => {
    const buttonClasses = [
      primaryButtonClass,
      secondaryButtonClass,
      iconButtonClass,
      dangerButtonClass,
      inputClass,
    ].join(" ");

    expect(primaryButtonClass).toContain("bg-[#93b8c2]/[0.72]");
    expect(primaryButtonClass).toContain("dark:bg-[#e5b84e]/[0.18]");
    expect(primaryButtonClass).toContain("dark:text-[#f3d98a]");
    expect(buttonClasses).not.toContain("emerald");
  });

  it("uses one frosted input token without white field backgrounds", () => {
    expect(inputClass).toContain("appearance-none");
    expect(inputClass).toContain("shadow-none");
    expect(inputClass).toContain("bg-[#fff8ee]/[0.24]");
    expect(inputClass).toContain("dark:bg-[#07111f]/[0.42]");
    expect(inputClass).toContain("placeholder:text-[#6f7e79]/60");
    expect(inputClass).toContain("dark:placeholder:text-slate-400/60");
    expect(inputClass).not.toContain("bg-white");
    expect(inputClass).not.toContain("bg-[#fff8ee]/24");
    expect(inputClass).not.toContain("dark:bg-[#07111f]/42");
    expect(inputClass).not.toContain("text-black");
  });
});
