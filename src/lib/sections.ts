export type SectionId = "home" | "shortcuts" | "tasks" | "deadlines" | "decision" | "data";

export type SectionMeta = {
  id: SectionId;
  label: string;
  subtitle: string;
};

export const sections: readonly SectionMeta[] = [
  { id: "home", label: "首页", subtitle: "回到今天真正要看的东西。" },
  { id: "shortcuts", label: "快捷入口", subtitle: "把常用网站收在一处，保持桌面清爽。" },
  { id: "tasks", label: "今日任务", subtitle: "只处理今天真正需要完成的事。" },
  { id: "deadlines", label: "DDL", subtitle: "把重要日子放在视野里，但别让它们压住你。" },
  { id: "decision", label: "随机决定", subtitle: "选择太多时，让桌面替你轻轻推一下。" },
  { id: "data", label: "数据工具", subtitle: "管理本地 JSON，不改变你的存储格式。" },
];

export function getSectionMeta(id: SectionId): SectionMeta {
  return sections.find((section) => section.id === id) ?? sections[0];
}
