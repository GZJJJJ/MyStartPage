"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  migrateLocalDataToCloud,
  replaceCloudDashboardData,
} from "./cloudData";
import { getBrowserSupabaseClient, isSupabaseConfigured } from "./supabaseClient";
import type { DashboardData } from "./types";

export type CloudSyncStatus = "idle" | "syncing" | "success" | "error";

export type CloudSyncControls = {
  configured: boolean;
  authenticated: boolean;
  userEmail: string | null;
  status: CloudSyncStatus;
  message: string;
  lastSyncedAt: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  syncNow: () => Promise<void>;
  testEmailReminder: () => Promise<void>;
};

const SYNC_DEBOUNCE_MS = 900;

function getSessionEmail(session: Session | null): string | null {
  return session?.user.email ?? null;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "操作失败";
}

async function requireSession(client: SupabaseClient): Promise<Session> {
  const { data, error } = await client.auth.getSession();

  if (error) {
    throw error;
  }

  if (!data.session) {
    throw new Error("请先登录");
  }

  return data.session;
}

export function useCloudSync(
  data: DashboardData,
  setData: (data: DashboardData) => void,
  dataReady: boolean,
): CloudSyncControls {
  const configured = isSupabaseConfigured();
  const client = useMemo(() => getBrowserSupabaseClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<CloudSyncStatus>("idle");
  const [message, setMessage] = useState(configured ? "" : "云同步暂不可用");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const initializedUserRef = useRef<string | null>(null);
  const debounceRef = useRef<number | null>(null);
  const applyingRemoteRef = useRef(false);

  useEffect(() => {
    if (!client) {
      return;
    }

    let active = true;

    client.auth.getSession().then(({ data: sessionData }) => {
      if (active) {
        setSession(sessionData.session);
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange((_event, nextSession) => {
      initializedUserRef.current = null;
      setSession(nextSession);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (!client || !dataReady || !session || initializedUserRef.current === session.user.id) {
      return;
    }

    let active = true;
    initializedUserRef.current = session.user.id;
    setStatus("syncing");
    setMessage("正在拉取云端数据");

    migrateLocalDataToCloud(client, data, session.user.id, getSessionEmail(session))
      .then((result) => {
        if (!active) {
          return;
        }

        applyingRemoteRef.current = true;
        setData(result.data);
        setLastSyncedAt(new Date().toISOString());
        setStatus("success");
        setMessage(result.migrated ? "已完成首次同步" : "已从云端同步");
        window.setTimeout(() => {
          applyingRemoteRef.current = false;
        }, 0);
      })
      .catch((error: unknown) => {
        if (active) {
          setStatus("error");
          setMessage(getErrorMessage(error));
        }
      });

    return () => {
      active = false;
    };
  }, [client, data, dataReady, session, setData]);

  const syncNow = useCallback(async () => {
    if (!client) {
      throw new Error("云同步暂不可用");
    }

    const currentSession = await requireSession(client);
    setStatus("syncing");
    setMessage("正在同步");
    await replaceCloudDashboardData(client, data, currentSession.user.id, getSessionEmail(currentSession));
    setLastSyncedAt(new Date().toISOString());
    setStatus("success");
    setMessage("刚刚同步");
  }, [client, data]);

  useEffect(() => {
    if (!client || !dataReady || !session || initializedUserRef.current !== session.user.id || applyingRemoteRef.current) {
      return;
    }

    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      syncNow().catch((error: unknown) => {
        setStatus("error");
        setMessage(getErrorMessage(error));
      });
    }, SYNC_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [client, data, dataReady, session, syncNow]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!client) {
      throw new Error("云同步暂不可用");
    }

    setStatus("syncing");
    const { error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      throw error;
    }

    setStatus("success");
    setMessage("已登录");
  }, [client]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!client) {
      throw new Error("云同步暂不可用");
    }

    setStatus("syncing");
    const { error } = await client.auth.signUp({ email, password });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      throw error;
    }

    setStatus("success");
    setMessage("注册请求已提交，请按邮件提示完成验证");
  }, [client]);

  const signOut = useCallback(async () => {
    if (!client) {
      return;
    }

    const { error } = await client.auth.signOut();

    if (error) {
      setStatus("error");
      setMessage(error.message);
      throw error;
    }

    initializedUserRef.current = null;
    setSession(null);
    setStatus("idle");
    setMessage("已退出登录，本地数据仍保留");
  }, [client]);

  const testEmailReminder = useCallback(async () => {
    if (!client) {
      throw new Error("云同步暂不可用");
    }

    const currentSession = await requireSession(client);
    setStatus("syncing");
    setMessage("正在发送测试邮件");

    const response = await fetch("/api/reminders/test", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${currentSession.access_token}`,
      },
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(payload?.error ?? "测试邮件发送失败");
    }

    setStatus("success");
    setMessage("测试邮件已发送");
  }, [client]);

  return {
    configured,
    authenticated: Boolean(session),
    userEmail: getSessionEmail(session),
    status,
    message,
    lastSyncedAt,
    signIn,
    signUp,
    signOut,
    syncNow,
    testEmailReminder,
  };
}
