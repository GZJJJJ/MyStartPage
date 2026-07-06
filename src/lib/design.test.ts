import { describe, expect, it } from "vitest";
import {
  dangerButtonClass,
  glassSurfaceClass,
  iconButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  softPanelClass,
} from "./design";

describe("design tokens", () => {
  it("uses one module-scoped glass surface token", () => {
    expect(glassSurfaceClass).toContain("rounded-[28px]");
    expect(glassSurfaceClass).toContain("border border-white/35");
    expect(glassSurfaceClass).toContain("bg-white/[0.20]");
    expect(glassSurfaceClass).toContain("backdrop-blur-2xl");
    expect(glassSurfaceClass).toContain("dark:bg-slate-950/[0.26]");
    expect(softPanelClass).toContain(glassSurfaceClass);
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
