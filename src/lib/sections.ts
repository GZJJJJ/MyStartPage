export type SectionId = "home" | "shortcuts" | "tasks" | "deadlines" | "decision" | "data";

export type SectionMeta = {
  id: SectionId;
  label: string;
  subtitle: string;
};

export const sections: readonly SectionMeta[] = [
  { id: "home", label: "首页", subtitle: "把今天要用的东西放在手边。" },
  { id: "shortcuts", label: "快捷入口", subtitle: "把常用网站收在一处。" },
  { id: "tasks", label: "今日任务", subtitle: "只看今天需要完成的事。" },
  { id: "deadlines", label: "DDL", subtitle: "重要日期放在这里，别等到最后一天。" },
  { id: "decision", label: "随机决定", subtitle: "选择太多时，让它帮你推一下。" },
  { id: "data", label: "数据工具", subtitle: "备份、导入和同步你的启动页数据。" },
];

export function getSectionMeta(id: SectionId): SectionMeta {
  return sections.find((section) => section.id === id) ?? sections[0];
}
