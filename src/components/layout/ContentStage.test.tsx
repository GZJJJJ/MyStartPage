import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createDefaultData } from "@/lib/storage";
import type { CloudSyncControls } from "@/lib/useCloudSync";
import { ContentStage } from "./ContentStage";

const cloudSync: CloudSyncControls = {
  configured: true,
  authenticated: false,
  userEmail: null,
  status: "idle",
  message: "",
  lastSyncedAt: null,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  syncNow: vi.fn(),
  testEmailReminder: vi.fn(),
};

describe("ContentStage layout", () => {
  it("starts below the fixed top status bar", () => {
    const data = createDefaultData();
    const html = renderToStaticMarkup(
      <ContentStage
        activeSection="home"
        data={data}
        cloudSync={cloudSync}
        onSectionChange={vi.fn()}
        onShortcutsChange={vi.fn()}
        onTasksChange={vi.fn()}
        onDeadlinesChange={vi.fn()}
        onDecisionChange={vi.fn()}
        onImport={vi.fn()}
      />,
    );

    expect(html).toContain("pt-56");
    expect(html).not.toContain("sm:pt-40");
    expect(html).toContain("xl:pt-36");
  });
});
