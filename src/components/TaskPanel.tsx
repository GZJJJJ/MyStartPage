"use client";

import { CheckSquare, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Panel } from "@/components/Panel";
import { dangerButtonClass, inputClass, primaryButtonClass, secondaryButtonClass } from "@/lib/design";
import { createId } from "@/lib/id";
import type { Task } from "@/lib/types";

type TaskPanelProps = {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  className?: string;
};

export function TaskPanel({ tasks, onChange, className = "" }: TaskPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [text, setText] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextText = text.trim();

    if (!nextText) {
      return;
    }

    onChange([
      ...tasks,
      {
        id: createId("task"),
        text: nextText,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
    setFormOpen(false);
  }

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <Panel
      title="任务清单"
      subtitle={`今日进度 ${completedCount}/${tasks.length}`}
      icon={CheckSquare}
      className={className}
      action={
        formOpen ? (
          <button type="button" onClick={() => setFormOpen(false)} className={`${secondaryButtonClass} px-3 py-2`}>
            <X size={16} />
            取消
          </button>
        ) : (
          <button type="button" onClick={() => setFormOpen(true)} className={`${secondaryButtonClass} px-3 py-2`}>
            <Plus size={16} />
            添加
          </button>
        )
      }
    >
      {formOpen ? (
        <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-3 rounded-[24px] border border-white/40 bg-white/22 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/22 sm:flex-row">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="添加任务"
            aria-label="添加今日任务"
            className={`${inputClass} h-11 min-w-0 flex-1 text-sm`}
          />
          <button type="submit" className={`${primaryButtonClass} h-11 px-4`}>
            <Plus size={16} />
            保存
          </button>
        </form>
      ) : null}

      <div className="space-y-1">
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#718078] dark:text-slate-400">今天还没有任务</p>
        ) : null}
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-4 border-b border-white/28 py-3 last:border-b-0 dark:border-white/10">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(event) =>
                onChange(
                  tasks.map((item) =>
                    item.id === task.id ? { ...item, completed: event.target.checked } : item,
                  ),
                )
              }
              className="h-4 w-4 rounded border-white/35 bg-[#fff8ee]/24 text-[#93b8c2] focus:ring-2 focus:ring-[#93b8c2]/25 dark:border-white/10 dark:bg-[#07111f]/42"
              aria-label={`完成 ${task.text}`}
            />
            <span
              className={`min-w-0 flex-1 break-words text-sm ${
                task.completed ? "text-[#718078]/55 line-through dark:text-slate-500" : "text-[#344046] dark:text-slate-100"
              }`}
            >
              {task.text}
            </span>
            <button
              type="button"
              onClick={() => onChange(tasks.filter((item) => item.id !== task.id))}
              className={dangerButtonClass}
              aria-label={`删除 ${task.text}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
