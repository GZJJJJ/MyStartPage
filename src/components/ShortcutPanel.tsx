"use client";

import { Edit3, ExternalLink, Link2, Plus, Save, Trash2, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Panel } from "@/components/Panel";
import {
  dangerButtonClass,
  iconButtonClass,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  tileClass,
} from "@/lib/design";
import { createId } from "@/lib/id";
import type { Shortcut } from "@/lib/types";

type ShortcutPanelProps = {
  shortcuts: Shortcut[];
  onChange: (shortcuts: Shortcut[]) => void;
  className?: string;
};

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function ShortcutPanel({ shortcuts, onChange, className = "" }: ShortcutPanelProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  function resetForm() {
    setFormOpen(false);
    setEditingId(null);
    setName("");
    setUrl("");
  }

  function openCreateForm() {
    setFormOpen(true);
    setEditingId(null);
    setName("");
    setUrl("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    const nextUrl = normalizeUrl(url);

    if (!nextName || !url.trim()) {
      return;
    }

    if (editingId) {
      onChange(
        shortcuts.map((shortcut) =>
          shortcut.id === editingId ? { ...shortcut, name: nextName, url: nextUrl } : shortcut,
        ),
      );
    } else {
      onChange([
        ...shortcuts,
        {
          id: createId("shortcut"),
          name: nextName,
          url: nextUrl,
          createdAt: new Date().toISOString(),
        },
      ]);
    }

    resetForm();
  }

  function startEdit(shortcut: Shortcut) {
    setFormOpen(true);
    setEditingId(shortcut.id);
    setName(shortcut.name);
    setUrl(shortcut.url);
  }

  return (
    <Panel
      title="入口列表"
      subtitle="新增表单默认收起"
      icon={Link2}
      className={className}
      action={
        formOpen ? (
          <button type="button" onClick={resetForm} className={`${secondaryButtonClass} px-3 py-2`}>
            <X size={16} />
            取消
          </button>
        ) : (
          <button type="button" onClick={openCreateForm} className={`${secondaryButtonClass} px-3 py-2`}>
            <Plus size={16} />
            新增
          </button>
        )
      }
    >
      {formOpen ? (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4 rounded-[24px] border border-white/40 bg-white/22 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/22 sm:grid-cols-[1fr_1.35fr_auto]">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="名称"
            aria-label="快捷入口名称"
            className={`${inputClass} h-11 text-sm`}
          />
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://example.com"
            aria-label="快捷入口地址"
            className={`${inputClass} h-11 text-sm`}
          />
          <button type="submit" className={`${primaryButtonClass} h-11 px-4`}>
            {editingId ? <Save size={16} /> : <Plus size={16} />}
            {editingId ? "保存" : "添加"}
          </button>
        </form>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shortcuts.map((shortcut) => (
          <div key={shortcut.id} className={`${tileClass} group/item min-w-0 p-4`}>
            <a href={shortcut.url} className="block min-w-0" target="_blank" rel="noreferrer">
              <span className="block truncate text-sm font-medium text-[#344046] dark:text-slate-100">
                {shortcut.name}
              </span>
              <span className="mt-1 block truncate text-xs text-[#718078] dark:text-slate-400">{shortcut.url}</span>
            </a>
            <div className="mt-4 flex items-center gap-2 opacity-60 transition group-hover/item:opacity-100 group-focus-within/item:opacity-100">
              <a
                href={shortcut.url}
                target="_blank"
                rel="noreferrer"
                className={iconButtonClass}
                aria-label={`打开 ${shortcut.name}`}
              >
                <ExternalLink size={15} />
              </a>
              <button
                type="button"
                onClick={() => startEdit(shortcut)}
                className={iconButtonClass}
                aria-label={`编辑 ${shortcut.name}`}
              >
                <Edit3 size={15} />
              </button>
              <button
                type="button"
                onClick={() => onChange(shortcuts.filter((item) => item.id !== shortcut.id))}
                className={dangerButtonClass}
                aria-label={`删除 ${shortcut.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
