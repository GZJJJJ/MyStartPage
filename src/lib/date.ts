import type { Deadline } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDaysRemaining(date: string, now = new Date()): number {
  const [year, month, day] = date.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = startOfLocalDay(now);

  return Math.round((target.getTime() - today.getTime()) / DAY_MS);
}

export function sortDeadlines(deadlines: Deadline[], now = new Date()): Deadline[] {
  return [...deadlines].sort((a, b) => {
    const daysA = getDaysRemaining(a.date, now);
    const daysB = getDaysRemaining(b.date, now);
    const expiredA = daysA < 0;
    const expiredB = daysB < 0;

    if (expiredA !== expiredB) {
      return expiredA ? 1 : -1;
    }

    return daysA - daysB;
  });
}
