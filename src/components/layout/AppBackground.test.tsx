import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { AppBackground } from "./AppBackground";

describe("AppBackground", () => {
  it("uses responsive Monet PNG backgrounds without global blur in light mode", () => {
    const html = renderToStaticMarkup(<AppBackground isDark={false} />);

    expect(html).toContain('media="(max-width: 640px)"');
    expect(html).toContain('srcSet="/backgrounds/monet-mobile.png"');
    expect(html).toContain('media="(max-width: 1024px)"');
    expect(html).toContain('srcSet="/backgrounds/monet-tablet.png"');
    expect(html).toContain('src="/backgrounds/monet-desktop.png"');
    expect(html).toContain("h-full w-full object-cover");
    expect(html).toContain("bg-[#fff8ee]/[0.16]");
    expect(html).not.toContain("backdrop-blur");
  });

  it("uses responsive Starry Night PNG backgrounds without global blur in dark mode", () => {
    const html = renderToStaticMarkup(<AppBackground isDark={true} />);

    expect(html).toContain('srcSet="/backgrounds/starry-mobile.png"');
    expect(html).toContain('srcSet="/backgrounds/starry-tablet.png"');
    expect(html).toContain('src="/backgrounds/starry-desktop.png"');
    expect(html).toContain("bg-[#050814]/[0.36]");
    expect(html).not.toContain(".jpg");
    expect(html).not.toContain("backdrop-blur");
  });
});
