import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createDefaultData } from "@/lib/storage";
import { inputClass } from "@/lib/design";
import type { CloudSyncControls } from "@/lib/useCloudSync";
import { DataTools } from "./DataTools";

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

describe("DataTools copy and fields", () => {
  it("shows user-facing backup and cloud sync copy without storage internals", () => {
    const html = renderToStaticMarkup(
      <DataTools data={createDefaultData()} cloudSync={cloudSync} onImport={vi.fn()} />,
    );

    expect(html).toContain("登录后，快捷入口、任务和 DDL 可以在多台设备间同步。");
    expect(html).toContain("数据备份");
    expect(html).toContain("导出一份本地备份，换设备或重装前可以用来恢复。");
    expect(html).toContain("导出备份");
    expect(html).toContain("导入备份");
    expect(html).toContain("备份文件只保存在你自己的设备上。导入前建议先导出现有数据。");
    expect(html).toContain(inputClass);
    expect(html).not.toContain("localStorage JSON");
    expect(html).not.toContain("localStorage key");
    expect(html).not.toContain("version 1");
    expect(html).not.toContain("schema");
    expect(html).not.toContain("migrate");
  });
});
