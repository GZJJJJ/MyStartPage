"use client";

import { CalendarDays, Plus, Trash2, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Panel } from "@/components/Panel";
import { getDaysRemaining, sortDeadlines } from "@/lib/date";
import { dangerButtonClass, inputClass, primaryButtonClass, secondaryButtonClass } from "@/lib/design";
import { createId } from "@/lib/id";
import { DEFAULT_REMINDER_DAYS } from "@/lib/storage";
import type { Deadline } from "@/lib/types";

type DeadlinePanelProps = {
  deadlines: Deadline[];
  onChange: (deadlines: Deadline[]) => void;
  className?: string;
};

function getStatusText(days: number): string {
  if (days === 0) {
    return "今天";
  }

  if (days > 0) {
    return `D-${days}`;
  }

  return `已过 ${Math.abs(days)} 天`;
}

function getUrgencyWidth(days: number): string {
  if (days <= 0) {
    return "100%";
  }

  return `${Math.max(14, 100 - Math.min(days, 30) * 2.6)}%`;
}

function parseReminderDays(value: string): number[] {
  const days = value
    .split(/[，,\s]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isInteger(item) && item >= 0);

  return days.length > 0 ? Array.from(new Set(days)) : [...DEFAULT_REMINDER_DAYS];
}

export function DeadlinePanel({ deadlines, onChange, className = "" }: DeadlinePanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [reminderDays, setReminderDays] = useState(DEFAULT_REMINDER_DAYS.join(", "));
  const [notifyByEmail, setNotifyByEmail] = useState(true);
  const sortedDeadlines = useMemo(() => sortDeadlines(deadlines), [deadlines]);

  function resetForm() {
    setFormOpen(false);
    setTitle("");
    setDate("");
    setNote("");
    setReminderDays(DEFAULT_REMINDER_DAYS.join(", "));
    setNotifyByEmail(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();

    if (!nextTitle || !date) {
      return;
    }

    onChange([
      ...deadlines,
      {
        id: createId("ddl"),
        title: nextTitle,
        date,
        note: note.trim(),
        reminderDays: parseReminderDays(reminderDays),
        notifyByEmail,
        notifyByWechat: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    resetForm();
  }

  return (
    <Panel
      title="倒计时列表"
      subtitle="按剩余时间自动排序"
      icon={CalendarDays}
      className={className}
      action={
        formOpen ? (
          <button type="button" onClick={resetForm} className={`${secondaryButtonClass} px-3 py-2`}>
            <X size={16} />
            取消
          </button>
        ) : (
          <button type="button" onClick={() => setFormOpen(true)} className={`${secondaryButtonClass} px-3 py-2`}>
            <Plus size={16} />
            添加事件
          </button>
        )
      }
    >
      {formOpen ? (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4 rounded-[24px] border border-white/40 bg-white/22 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/22 sm:grid-cols-2">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="事件名称"
            aria-label="DDL 事件名称"
            className={`${inputClass} h-11 px-4 text-sm`}
          />
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            aria-label="DDL 日期"
            className={`${inputClass} h-11 px-4 text-sm`}
          />
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="备注"
            aria-label="DDL 备注"
            className={`${inputClass} h-11 px-4 text-sm sm:col-span-2`}
          />
          <input
            value={reminderDays}
            onChange={(event) => setReminderDays(event.target.value)}
            placeholder="提醒天数，例如 7, 3, 1, 0"
            aria-label="DDL 提醒天数"
            className={`${inputClass} h-11 px-4 text-sm sm:col-span-2`}
          />
          <label className="inline-flex items-center gap-2 text-sm text-[#596861] dark:text-slate-300">
            <input
              type="checkbox"
              checked={notifyByEmail}
              onChange={(event) => setNotifyByEmail(event.target.checked)}
              className="rounded border-white/40 bg-white/30 text-[#6f969b] focus:ring-[#93b8c2]/30"
            />
            邮件提醒
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-[#718078] dark:text-slate-400">
            <input type="checkbox" checked={false} disabled className="rounded border-white/40 bg-white/30" />
            微信提醒（预留）
          </label>
          <button type="submit" className={`${primaryButtonClass} h-11 px-4 sm:col-span-2`}>
            <Plus size={16} />
            保存事件
          </button>
        </form>
      ) : null}

      <div className="space-y-4">
        {sortedDeadlines.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#718078] dark:text-slate-400">暂无倒计时</p>
        ) : null}
        {sortedDeadlines.map((deadline) => {
          const days = getDaysRemaining(deadline.date);
          const expired = days < 0;
          const urgent = days >= 0 && days <= 3;

          return (
            <div key={deadline.id} className="rounded-[22px] border border-white/30 bg-white/18 p-4 dark:border-white/10 dark:bg-slate-950/18">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="break-words text-sm font-medium text-[#344046] dark:text-slate-100">
                    {deadline.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#718078] dark:text-slate-400">{deadline.date}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      expired
                        ? "bg-rose-100/40 text-rose-700 dark:bg-rose-950/25 dark:text-rose-300"
                        : urgent
                          ? "bg-[#e99d6f]/24 text-[#8c5d3c] dark:bg-[#e5b84e]/14 dark:text-[#f3d98a]"
                          : "bg-[#93b8c2]/24 text-[#4f7076] dark:bg-[#1d3f72]/34 dark:text-[#b8ced2]"
                    }`}
                  >
                    {getStatusText(days)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(deadlines.filter((item) => item.id !== deadline.id))}
                    className={dangerButtonClass}
                    aria-label={`删除 ${deadline.title}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/34 dark:bg-white/10">
                <div
                  className={`h-full rounded-full ${urgent || expired ? "bg-[#e99d6f]/70 dark:bg-[#e5b84e]/60" : "bg-[#93b8c2]/70 dark:bg-[#274b8a]/80"}`}
                  style={{ width: getUrgencyWidth(days) }}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#718078] dark:text-slate-400">
                <span>提醒：{deadline.reminderDays.join(" / ")} 天</span>
                <span>{deadline.notifyByEmail ? "邮件开启" : "邮件关闭"}</span>
                <span>{deadline.notifyByWechat ? "微信开启" : "微信预留"}</span>
              </div>
              {deadline.note ? (
                <p className="mt-3 break-words text-sm text-[#596861] dark:text-slate-300">{deadline.note}</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
