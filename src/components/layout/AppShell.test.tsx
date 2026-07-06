import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell art background", () => {
  it("keeps the shell and main layout transparent in light mode", () => {
    const html = renderToStaticMarkup(
      <AppShell activeSection="home" darkMode={false} onSectionChange={vi.fn()} topBar={<div />}>
        <div />
      </AppShell>,
    );

    expect(html).toContain('src="/backgrounds/monet-desktop.png"');
    expect(html).toContain("main-shell min-h-screen pb-24 transition-all sm:pl-16 sm:pb-0");
    expect(html).not.toContain("monet-light.jpg");
    expect(html).not.toContain("backdrop-blur-[2px]");
  });

  it("uses dark responsive background without glassing the page shell", () => {
    const html = renderToStaticMarkup(
      <AppShell activeSection="home" darkMode={true} onSectionChange={vi.fn()} topBar={<div />}>
        <div />
      </AppShell>,
    );

    expect(html).toContain('src="/backgrounds/starry-desktop.png"');
    expect(html).not.toContain("starry-night-dark.jpg");
    expect(html).not.toContain("fixed inset-0 -z-10");
  });
});