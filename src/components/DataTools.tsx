"use client";

import { Archive, Cloud, Download, LogIn, LogOut, Mail, RefreshCw, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Panel } from "@/components/Panel";
import { inputClass, primaryButtonClass, secondaryButtonClass } from "@/lib/design";
import { createExportPayload, parseImportPayload } from "@/lib/storage";
import type { CloudSyncControls } from "@/lib/useCloudSync";
import type { DashboardData } from "@/lib/types";

type DataToolsProps = {
  data: DashboardData;
  cloudSync: CloudSyncControls;
  onImport: (data: DashboardData) => void;
  className?: string;
};

function formatSyncTime(value: string | null): string {
  if (!value) {
    return "尚未同步";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DataTools({ data, cloudSync, onImport, className = "" }: DataToolsProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const busy = cloudSync.status === "syncing";

  function exportData() {
    const payload = createExportPayload(data);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `my-start-page-${payload.exportedAt.slice(0, 10)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    setMessage("已导出 JSON");
  }

  function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!window.confirm("导入会覆盖当前本地数据，是否继续？")) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportPayload(String(reader.result));
        onImport(imported);
        setMessage("导入成功，已写入 localStorage，登录后会自动同步到云端");
      } catch {
        setMessage("导入失败：JSON 格式不正确");
      }
    };
    reader.readAsText(file);
  }

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setMessage("请输入邮箱和密码");
      return;
    }

    try {
      await cloudSync.signIn(email.trim(), password);
      setPassword("");
      setMessage("已登录");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登录失败");
    }
  }

  async function handleSignUp() {
    if (!email.trim() || !password) {
      setMessage("请输入邮箱和密码");
      return;
    }

    try {
      await cloudSync.signUp(email.trim(), password);
      setPassword("");
      setMessage("注册请求已提交");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "注册失败");
    }
  }

  async function runAction(action: () => Promise<void>, success: string) {
    try {
      await action();
      setMessage(success);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "操作失败");
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <Panel title="云同步" subtitle="Supabase Auth + Postgres" icon={Cloud}>
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[22px] border border-white/30 bg-white/18 p-4 dark:border-white/10 dark:bg-slate-950/18">
            <p className="text-sm font-medium text-[#344046] dark:text-slate-100">
              {cloudSync.authenticated ? "已登录" : "未登录"}
            </p>
            <p className="mt-1 break-words text-sm text-[#718078] dark:text-slate-400">
              {cloudSync.authenticated ? cloudSync.userEmail : cloudSync.configured ? "登录后会自动迁移本地数据并同步" : "缺少 Supabase 环境变量"}
            </p>
            <p className="mt-3 text-sm text-[#718078] dark:text-slate-400">最近同步：{formatSyncTime(cloudSync.lastSyncedAt)}</p>
            {cloudSync.message ? <p className="mt-3 text-sm text-[#4f7076] dark:text-[#b8ced2]">{cloudSync.message}</p> : null}
          </div>

          {cloudSync.authenticated ? (
            <div className="grid content-start gap-3">
              <button
                type="button"
                onClick={() => runAction(cloudSync.syncNow, "已手动同步")}
                disabled={busy}
                className={primaryButtonClass}
              >
                <RefreshCw size={17} />
                手动同步
              </button>
              <button
                type="button"
                onClick={() => runAction(cloudSync.testEmailReminder, "测试邮件已发送")}
                disabled={busy}
                className={secondaryButtonClass}
              >
                <Mail size={17} />
                测试邮件提醒
              </button>
              <button
                type="button"
                onClick={() => runAction(cloudSync.signOut, "已退出登录")}
                disabled={busy}
                className={secondaryButtonClass}
              >
                <LogOut size={17} />
                退出登录
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit} className="grid content-start gap-3">
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="邮箱"
                aria-label="登录邮箱"
                className={`${inputClass} h-11 px-4 text-sm`}
                disabled={!cloudSync.configured || busy}
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                placeholder="密码"
                aria-label="登录密码"
                className={`${inputClass} h-11 px-4 text-sm`}
                disabled={!cloudSync.configured || busy}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="submit" disabled={!cloudSync.configured || busy} className={primaryButtonClass}>
                  <LogIn size={17} />
                  登录
                </button>
                <button type="button" onClick={handleSignUp} disabled={!cloudSync.configured || busy} className={secondaryButtonClass}>
                  注册
                </button>
              </div>
            </form>
          )}
        </div>
      </Panel>

      <Panel title="提醒渠道" subtitle="DDL reminders" icon={Mail}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[22px] border border-white/30 bg-white/18 p-4 dark:border-white/10 dark:bg-slate-950/18">
            <p className="text-sm font-medium text-[#344046] dark:text-slate-100">邮件提醒</p>
            <p className="mt-1 text-sm text-[#718078] dark:text-slate-400">已实现，默认发送到登录邮箱。</p>
          </div>
          <div className="rounded-[22px] border border-white/30 bg-white/18 p-4 dark:border-white/10 dark:bg-slate-950/18">
            <p className="text-sm font-medium text-[#344046] dark:text-slate-100">微信提醒</p>
            <p className="mt-1 text-sm text-[#718078] dark:text-slate-400">字段已预留，第一版暂不发送。</p>
          </div>
        </div>
      </Panel>

      <Panel title="JSON 备份" subtitle="localStorage JSON" icon={Archive}>
        <div className="grid gap-4 sm:grid-cols-2">
          <button type="button" onClick={exportData} className={primaryButtonClass}>
            <Download size={17} />
            导出 JSON
          </button>
          <button type="button" onClick={() => inputRef.current?.click()} className={secondaryButtonClass}>
            <Upload size={17} />
            导入 JSON
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="application/json"
          onChange={handleImport}
          className="hidden"
          aria-label="导入 JSON 文件"
        />
        <p className="mt-5 text-sm leading-6 text-[#718078] dark:text-slate-400">
          本地缓存仍使用原 localStorage key。导入导出的 JSON 仍为 version 1，旧 DDL 会自动补默认提醒字段。
        </p>
        {message ? <p className="mt-4 text-sm text-[#4f7076] dark:text-[#b8ced2]">{message}</p> : null}
      </Panel>
    </div>
  );
}
