import { describe, expect, it } from "vitest";
import {
  buildDeadlineEmail,
  getDueDeadlineReminders,
  getReminderLogKey,
} from "./deadlineReminders";

describe("getDueDeadlineReminders", () => {
  it("returns email reminders due today and skips existing logs", () => {
    const deadlines = [
      {
        id: "d1",
        user_id: "user-1",
        title: "Report",
        date: "2026-07-09",
        note: "Attach appendix",
        reminder_days: [7, 3, 1, 0],
        notify_by_email: true,
        notify_by_wechat: false,
        email: "joe@example.com",
      },
      {
        id: "d2",
        user_id: "user-1",
        title: "Muted",
        date: "2026-07-09",
        note: "",
        reminder_days: [3],
        notify_by_email: false,
        notify_by_wechat: false,
        email: "joe@example.com",
      },
    ];

    expect(getDueDeadlineReminders(deadlines, new Date("2026-07-06T08:00:00.000Z"), new Set())).toHaveLength(1);

    const logKey = getReminderLogKey({
      userId: "user-1",
      deadlineId: "d1",
      channel: "email",
      reminderDaysBefore: 3,
      sentOn: "2026-07-06",
    });

    expect(getDueDeadlineReminders(deadlines, new Date("2026-07-06T08:00:00.000Z"), new Set([logKey]))).toEqual([]);
  });
});

describe("buildDeadlineEmail", () => {
  it("includes deadline fields and deterministic advice", () => {
    const email = buildDeadlineEmail({
      to: "joe@example.com",
      title: "Report",
      date: "2026-07-09",
      note: "Attach appendix",
      daysRemaining: 3,
    });

    expect(email.subject).toContain("Report");
    expect(email.html).toContain("2026-07-09");
    expect(email.html).toContain("剩余 3 天");
    expect(email.html).toContain("Attach appendix");
    expect(email.html).toContain("今日建议");
  });
});
