import type { SupabaseClient } from "@supabase/supabase-js";
import { cloudRowsToDashboardData, dashboardDataToCloudRows } from "./cloudSync";
import type { DeadlineRow, SettingsRow, ShortcutRow, TaskRow } from "./cloudSync";
import type { DashboardData } from "./types";

type SyncTable = "shortcuts" | "tasks" | "deadlines";

type SyncResult = {
  data: DashboardData | null;
  hasCloudData: boolean;
};

async function throwIfError<T>(result: { data: T; error: { message: string } | null }): Promise<T> {
  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data;
}

async function getExistingIds(client: SupabaseClient, table: SyncTable, userId: string): Promise<string[]> {
  const data = await throwIfError(
    await client.from(table).select("id").eq("user_id", userId),
  );

  return ((data ?? []) as { id: string }[]).map((row) => row.id);
}

async function replaceRows(client: SupabaseClient, table: SyncTable, userId: string, rows: { id: string }[]): Promise<void> {
  if (rows.length > 0) {
    await throwIfError(await client.from(table).upsert(rows, { onConflict: "user_id,id" }).select("id"));
  }

  const currentIds = new Set(rows.map((row) => row.id));
  const staleIds = (await getExistingIds(client, table, userId)).filter((id) => !currentIds.has(id));

  if (staleIds.length > 0) {
    await throwIfError(await client.from(table).delete().eq("user_id", userId).in("id", staleIds).select("id"));
  }
}

export async function fetchCloudDashboardData(client: SupabaseClient, userId: string): Promise<SyncResult> {
  const [shortcuts, tasks, deadlines, settings] = await Promise.all([
    throwIfError(await client.from("shortcuts").select("id,name,url,created_at").eq("user_id", userId).order("created_at")),
    throwIfError(await client.from("tasks").select("id,text,completed,notify_by_email,notify_by_wechat,created_at").eq("user_id", userId).order("created_at")),
    throwIfError(await client.from("deadlines").select("id,title,date,note,reminder_days,notify_by_email,notify_by_wechat,created_at").eq("user_id", userId).order("date")),
    throwIfError(await client.from("settings").select("note,decision_options,search_engine,email,migrated_at").eq("user_id", userId).maybeSingle()),
  ]);

  const hasCloudData = Boolean(
    settings ||
      (shortcuts as ShortcutRow[] | null)?.length ||
      (tasks as TaskRow[] | null)?.length ||
      (deadlines as DeadlineRow[] | null)?.length,
  );

  if (!hasCloudData) {
    return { data: null, hasCloudData: false };
  }

  return {
    data: cloudRowsToDashboardData({
      shortcuts: (shortcuts ?? []) as ShortcutRow[],
      tasks: (tasks ?? []) as TaskRow[],
      deadlines: (deadlines ?? []) as DeadlineRow[],
      settings: settings as SettingsRow | null,
    }),
    hasCloudData: true,
  };
}

export async function replaceCloudDashboardData(
  client: SupabaseClient,
  data: DashboardData,
  userId: string,
  email: string | null,
): Promise<void> {
  const rows = dashboardDataToCloudRows(data, userId, email);

  await throwIfError(
    await client
      .from("settings")
      .upsert({ ...rows.settings, migrated_at: new Date().toISOString() }, { onConflict: "user_id" })
      .select("user_id"),
  );
  await replaceRows(client, "shortcuts", userId, rows.shortcuts);
  await replaceRows(client, "tasks", userId, rows.tasks);
  await replaceRows(client, "deadlines", userId, rows.deadlines);
}

export async function migrateLocalDataToCloud(
  client: SupabaseClient,
  data: DashboardData,
  userId: string,
  email: string | null,
): Promise<{ migrated: boolean; data: DashboardData }> {
  const cloud = await fetchCloudDashboardData(client, userId);

  if (cloud.hasCloudData && cloud.data) {
    return { migrated: false, data: cloud.data };
  }

  await replaceCloudDashboardData(client, data, userId, email);
  return { migrated: true, data };
}
