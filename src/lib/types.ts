export type SearchEngineId = "baidu" | "google" | "github" | "bilibili";

export type Shortcut = {
  id: string;
  name: string;
  url: string;
  createdAt: string;
};

export type Task = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

export type Deadline = {
  id: string;
  title: string;
  date: string;
  note: string;
  reminderDays: number[];
  notifyByEmail: boolean;
  notifyByWechat: boolean;
  createdAt: string;
};

export type DashboardData = {
  shortcuts: Shortcut[];
  tasks: Task[];
  deadlines: Deadline[];
  note: string;
  decisionOptions: string;
  searchEngine: SearchEngineId;
};

export type ExportPayload = {
  version: 1;
  exportedAt: string;
  data: DashboardData;
};
