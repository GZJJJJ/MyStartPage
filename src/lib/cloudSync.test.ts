import { describe, expect, it } from "vitest";
import { cloudRowsToDashboardData, dashboardDataToCloudRows } from "./cloudSync";
import type { DashboardData } from "./types";

describe("dashboardDataToCloudRows", () => {
  it("maps local dashboard data to user-scoped Supabase rows", () => {
    const data: DashboardData = {
      shortcuts: [{ id: "s1", name: "Docs", url: "https://docs.example", createdAt: "2026-07-01T00:00:00.000Z" }],
      tasks: [{ id: "t1", text: "Ship sync", completed: false, createdAt: "2026-07-02T00:00:00.000Z" }],
      deadlines: [
        {
          id: "d1",
          title: "Report",
          date: "2026-07-09",
          note: "Attach appendix",
          reminderDays: [3, 1, 0],
          notifyByEmail: true,
          notifyByWechat: false,
          createdAt: "2026-07-03T00:00:00.000Z",
        },
      ],
      note: "memo",
      decisionOptions: "A\nB",
      searchEngine: "github",
    };

    const rows = dashboardDataToCloudRows(data, "user-1", "joe@example.com");

    expect(rows.shortcuts[0]).toMatchObject({ id: "s1", user_id: "user-1", name: "Docs" });
    expect(rows.tasks[0]).toMatchObject({ id: "t1", user_id: "user-1", completed: false });
    expect(rows.deadlines[0]).toMatchObject({
      id: "d1",
      user_id: "user-1",
      reminder_days: [3, 1, 0],
      notify_by_email: true,
      notify_by_wechat: false,
    });
    expect(rows.settings).toMatchObject({
      user_id: "user-1",
      note: "memo",
      decision_options: "A\nB",
      search_engine: "github",
      email: "joe@example.com",
    });
  });
});

describe("cloudRowsToDashboardData", () => {
  it("maps Supabase rows back to the existing dashboard shape", () => {
    const data = cloudRowsToDashboardData({
      shortcuts: [{ id: "s1", name: "Docs", url: "https://docs.example", created_at: "2026-07-01T00:00:00.000Z" }],
      tasks: [{ id: "t1", text: "Ship sync", completed: true, created_at: "2026-07-02T00:00:00.000Z" }],
      deadlines: [
        {
          id: "d1",
          title: "Report",
          date: "2026-07-09",
          note: "Attach appendix",
          reminder_days: [7, 3],
          notify_by_email: false,
          notify_by_wechat: true,
          created_at: "2026-07-03T00:00:00.000Z",
        },
      ],
      settings: {
        note: "memo",
        decision_options: "A\nB",
        search_engine: "google",
        email: "joe@example.com",
      },
    });

    expect(data).toEqual({
      shortcuts: [{ id: "s1", name: "Docs", url: "https://docs.example", createdAt: "2026-07-01T00:00:00.000Z" }],
      tasks: [{ id: "t1", text: "Ship sync", completed: true, createdAt: "2026-07-02T00:00:00.000Z" }],
      deadlines: [
        {
          id: "d1",
          title: "Report",
          date: "2026-07-09",
          note: "Attach appendix",
          reminderDays: [7, 3],
          notifyByEmail: false,
          notifyByWechat: true,
          createdAt: "2026-07-03T00:00:00.000Z",
        },
      ],
      note: "memo",
      decisionOptions: "A\nB",
      searchEngine: "google",
    });
  });
});
