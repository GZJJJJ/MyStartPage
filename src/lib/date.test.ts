import { describe, expect, it } from "vitest";
import { getDaysRemaining, sortDeadlines } from "./date";
import type { Deadline } from "./types";

function deadline(id: string, date: string, createdAt: string): Deadline {
  return {
    id,
    title: id,
    date,
    note: "",
    reminderDays: [7, 3, 1, 0],
    notifyByEmail: true,
    notifyByWechat: false,
    createdAt,
  };
}

describe("getDaysRemaining", () => {
  it("returns 0 for today", () => {
    expect(getDaysRemaining("2026-07-06", new Date("2026-07-06T08:00:00"))).toBe(0);
  });

  it("returns positive days for future dates", () => {
    expect(getDaysRemaining("2026-07-09", new Date("2026-07-06T23:00:00"))).toBe(3);
  });

  it("returns negative days for expired dates", () => {
    expect(getDaysRemaining("2026-07-01", new Date("2026-07-06T08:00:00"))).toBe(-5);
  });
});

describe("sortDeadlines", () => {
  it("sorts active deadlines by days remaining and moves expired ones last", () => {
    const deadlines: Deadline[] = [
      deadline("expired", "2026-07-01", "a"),
      deadline("later", "2026-07-20", "b"),
      deadline("soon", "2026-07-07", "c"),
    ];

    expect(sortDeadlines(deadlines, new Date("2026-07-06T08:00:00")).map((item) => item.id)).toEqual([
      "soon",
      "later",
      "expired",
    ]);
  });
});
