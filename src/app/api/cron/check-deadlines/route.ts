import { isCronRequestAuthorized } from "@/lib/apiAuth";
import {
  buildDeadlineEmail,
  getDueDeadlineReminders,
  getReminderLogKey,
  getUtcDateString,
} from "@/lib/deadlineReminders";
import type { DeadlineReminderSource } from "@/lib/deadlineReminders";
import { sendDeadlineEmail } from "@/lib/email";
import { createServiceSupabaseClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

type ReminderLogRow = {
  user_id: string;
  deadline_id: string;
  channel: "email" | "wechat";
  reminder_days_before: number;
  sent_on: string;
};

type DeadlineRow = Omit<DeadlineReminderSource, "email">;

type SettingsRow = {
  user_id: string;
  email: string | null;
};

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export async function GET(request: Request): Promise<Response> {
  if (!isCronRequestAuthorized(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const today = getUtcDateString();
    const maxDate = addDays(today, 30);
    const serviceClient = createServiceSupabaseClient();

    const [{ data: deadlines, error: deadlineError }, { data: settings, error: settingsError }, { data: logs, error: logsError }] =
      await Promise.all([
        serviceClient
          .from("deadlines")
          .select("id,user_id,title,date,note,reminder_days,notify_by_email,notify_by_wechat")
          .gte("date", today)
          .lte("date", maxDate),
        serviceClient.from("settings").select("user_id,email"),
        serviceClient
          .from("reminder_logs")
          .select("user_id,deadline_id,channel,reminder_days_before,sent_on")
          .eq("channel", "email")
          .eq("sent_on", today),
      ]);

    if (deadlineError) {
      throw new Error(deadlineError.message);
    }
    if (settingsError) {
      throw new Error(settingsError.message);
    }
    if (logsError) {
      throw new Error(logsError.message);
    }

    const emailByUserId = new Map(
      ((settings ?? []) as SettingsRow[])
        .filter((row) => row.email)
        .map((row) => [row.user_id, row.email as string]),
    );
    const existingLogKeys = new Set(
      ((logs ?? []) as ReminderLogRow[]).map((log) =>
        getReminderLogKey({
          userId: log.user_id,
          deadlineId: log.deadline_id,
          channel: log.channel,
          reminderDaysBefore: log.reminder_days_before,
          sentOn: log.sent_on,
        }),
      ),
    );
    const sources: DeadlineReminderSource[] = ((deadlines ?? []) as DeadlineRow[]).map((deadline) => ({
      ...deadline,
      email: emailByUserId.get(deadline.user_id) ?? null,
    }));
    const dueReminders = getDueDeadlineReminders(sources, new Date(), existingLogKeys);
    const failures: string[] = [];
    let sent = 0;

    for (const reminder of dueReminders) {
      try {
        const providerId = await sendDeadlineEmail(
          buildDeadlineEmail({
            to: reminder.to,
            title: reminder.title,
            date: reminder.date,
            note: reminder.note,
            daysRemaining: reminder.daysRemaining,
          }),
        );

        const { error: logError } = await serviceClient.from("reminder_logs").insert({
          user_id: reminder.userId,
          deadline_id: reminder.deadlineId,
          channel: "email",
          reminder_days_before: reminder.daysRemaining,
          sent_on: reminder.sentOn,
          recipient_email: reminder.to,
          email_provider_id: providerId,
        });

        if (logError) {
          throw new Error(logError.message);
        }

        sent += 1;
      } catch (error) {
        failures.push(`${reminder.deadlineId}: ${error instanceof Error ? error.message : "发送失败"}`);
      }
    }

    return Response.json({ ok: true, checked: sources.length, due: dueReminders.length, sent, failures });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Cron 执行失败" },
      { status: 500 },
    );
  }
}
