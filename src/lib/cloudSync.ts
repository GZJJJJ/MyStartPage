import { createDefaultData, DEFAULT_REMINDER_DAYS } from "./storage";
import type { DashboardData, Deadline, SearchEngineId } from "./types";

export type ShortcutRow = {
  id: string;
  user_id?: string;
  name: string;
  url: string;
  created_at: string;
};

export type TaskRow = {
  id: string;
  user_id?: string;
  text: string;
  completed: boolean;
  created_at: string;
};

export type DeadlineRow = {
  id: string;
  user_id?: string;
  title: string;
  date: string;
  note: string;
  reminder_days: number[] | null;
  notify_by_email: boolean | null;
  notify_by_wechat: boolean | null;
  created_at: string;
};

export type SettingsRow = {
  user_id?: string;
  note: string | null;
  decision_options: string | null;
  search_engine: SearchEngineId | null;
  email: string | null;
  migrated_at?: string | null;
};

type CloudRows = {
  shortcuts: ShortcutRow[];
  tasks: TaskRow[];
  deadlines: DeadlineRow[];
  settings: SettingsRow | null;
};

function normalizeReminderDays(value: number[] | null): number[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_REMINDER_DAYS];
  }

  const days = value.filter((item) => Number.isInteger(item) && item >= 0);
  return days.length > 0 ? days : [...DEFAULT_REMINDER_DAYS];
}

function toDeadline(row: DeadlineRow): Deadline {
  return {
    id: row.id,
    title: row.title,
    date: row.date,
    note: row.note,
    reminderDays: normalizeReminderDays(row.reminder_days),
    notifyByEmail: row.notify_by_email ?? true,
    notifyByWechat: row.notify_by_wechat ?? false,
    createdAt: row.created_at,
  };
}

export function dashboardDataToCloudRows(data: DashboardData, userId: string, email: string | null): CloudRows {
  return {
    shortcuts: data.shortcuts.map((shortcut) => ({
      id: shortcut.id,
      user_id: userId,
      name: shortcut.name,
      url: shortcut.url,
      created_at: shortcut.createdAt,
    })),
    tasks: data.tasks.map((task) => ({
      id: task.id,
      user_id: userId,
      text: task.text,
      completed: task.completed,
      created_at: task.createdAt,
    })),
    deadlines: data.deadlines.map((deadline) => ({
      id: deadline.id,
      user_id: userId,
      title: deadline.title,
      date: deadline.date,
      note: deadline.note,
      reminder_days: deadline.reminderDays,
      notify_by_email: deadline.notifyByEmail,
      notify_by_wechat: deadline.notifyByWechat,
      created_at: deadline.createdAt,
    })),
    settings: {
      user_id: userId,
      note: data.note,
      decision_options: data.decisionOptions,
      search_engine: data.searchEngine,
      email,
    },
  };
}

export function cloudRowsToDashboardData(rows: CloudRows): DashboardData {
  const defaults = createDefaultData();

  return {
    shortcuts: rows.shortcuts.map((shortcut) => ({
      id: shortcut.id,
      name: shortcut.name,
      url: shortcut.url,
      createdAt: shortcut.created_at,
    })),
    tasks: rows.tasks.map((task) => ({
      id: task.id,
      text: task.text,
      completed: task.completed,
      createdAt: task.created_at,
    })),
    deadlines: rows.deadlines.map(toDeadline),
    note: rows.settings?.note ?? defaults.note,
    decisionOptions: rows.settings?.decision_options ?? defaults.decisionOptions,
    searchEngine: rows.settings?.search_engine ?? defaults.searchEngine,
  };
}
