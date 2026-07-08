import type {
  DashboardData,
  Deadline,
  ExportPayload,
  SearchEngineId,
  Shortcut,
  Task,
} from "./types";

export const STORAGE_KEY = "my-start-page:data:v1";
export const THEME_KEY = "my-start-page:theme:v1";
export const DEFAULT_REMINDER_DAYS = [7, 3, 1, 0];

const SEARCH_ENGINES: SearchEngineId[] = ["baidu", "google", "github", "bilibili"];

export function createDefaultData(): DashboardData {
  const createdAt = new Date(0).toISOString();

  return {
    shortcuts: [
      { id: "starter-baidu", name: "百度", url: "https://www.baidu.com", createdAt },
      { id: "starter-google", name: "Google", url: "https://www.google.com", createdAt },
      { id: "starter-github", name: "GitHub", url: "https://github.com", createdAt },
      { id: "starter-bilibili", name: "B站", url: "https://www.bilibili.com", createdAt },
    ],
    tasks: [],
    deadlines: [],
    note: "",
    decisionOptions: "",
    searchEngine: "baidu",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isSearchEngine(value: unknown): value is SearchEngineId {
  return isString(value) && SEARCH_ENGINES.includes(value as SearchEngineId);
}

function isShortcut(value: unknown): value is Shortcut {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.name) &&
    isString(value.url) &&
    isString(value.createdAt)
  );
}

function normalizeTask(value: unknown): Task | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.text) ||
    typeof value.completed !== "boolean" ||
    !isString(value.createdAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    text: value.text,
    completed: value.completed,
    notifyByEmail: typeof value.notifyByEmail === "boolean" ? value.notifyByEmail : false,
    notifyByWechat: typeof value.notifyByWechat === "boolean" ? value.notifyByWechat : false,
    createdAt: value.createdAt,
  };
}

function normalizeReminderDays(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [...DEFAULT_REMINDER_DAYS];
  }

  const days = value.filter((item): item is number => Number.isInteger(item) && item >= 0);
  return days.length > 0 ? Array.from(new Set(days)) : [...DEFAULT_REMINDER_DAYS];
}

function normalizeDeadline(value: unknown): Deadline | null {
  if (
    !isRecord(value) ||
    !isString(value.id) ||
    !isString(value.title) ||
    !isString(value.date) ||
    !isString(value.note) ||
    !isString(value.createdAt)
  ) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    date: value.date,
    note: value.note,
    reminderDays: normalizeReminderDays(value.reminderDays),
    notifyByEmail: typeof value.notifyByEmail === "boolean" ? value.notifyByEmail : true,
    notifyByWechat: typeof value.notifyByWechat === "boolean" ? value.notifyByWechat : false,
    createdAt: value.createdAt,
  };
}

export function normalizeDashboardData(value: unknown): DashboardData | null {
  if (
    !isRecord(value) ||
    !Array.isArray(value.shortcuts) ||
    !value.shortcuts.every(isShortcut) ||
    !Array.isArray(value.tasks) ||
    !Array.isArray(value.deadlines) ||
    !isString(value.note) ||
    !isString(value.decisionOptions) ||
    !isSearchEngine(value.searchEngine)
  ) {
    return null;
  }

  const tasks = value.tasks.map(normalizeTask);
  if (tasks.some((item) => item === null)) {
    return null;
  }

  const deadlines = value.deadlines.map(normalizeDeadline);
  if (deadlines.some((item) => item === null)) {
    return null;
  }

  return {
    shortcuts: value.shortcuts,
    tasks: tasks as Task[],
    deadlines: deadlines as Deadline[],
    note: value.note,
    decisionOptions: value.decisionOptions,
    searchEngine: value.searchEngine,
  };
}

export function isDashboardData(value: unknown): value is DashboardData {
  return normalizeDashboardData(value) !== null;
}

export function parseImportPayload(json: string): DashboardData {
  let parsed: unknown;

  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid import file");
  }

  if (!isRecord(parsed) || parsed.version !== 1 || !isString(parsed.exportedAt)) {
    throw new Error("Invalid import file");
  }

  const data = normalizeDashboardData(parsed.data);
  if (!data) {
    throw new Error("Invalid import file");
  }

  return data;
}

export function createExportPayload(data: DashboardData): ExportPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function loadDashboardData(): DashboardData {
  if (typeof window === "undefined") {
    return createDefaultData();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createDefaultData();
  }

  try {
    const parsed = JSON.parse(raw);
    return normalizeDashboardData(parsed) ?? createDefaultData();
  } catch {
    return createDefaultData();
  }
}

export function saveDashboardData(data: DashboardData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
