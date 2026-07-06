export type ReminderChannel = "email" | "wechat";

export type ReminderLogIdentity = {
  userId: string;
  deadlineId: string;
  channel: ReminderChannel;
  reminderDaysBefore: number;
  sentOn: string;
};

export type DeadlineReminderSource = {
  id: string;
  user_id: string;
  title: string;
  date: string;
  note: string;
  reminder_days: number[] | null;
  notify_by_email: boolean | null;
  notify_by_wechat: boolean | null;
  email: string | null;
};

export type DueDeadlineReminder = {
  userId: string;
  deadlineId: string;
  to: string;
  title: string;
  date: string;
  note: string;
  daysRemaining: number;
  sentOn: string;
};

export type DeadlineEmail = {
  to: string;
  subject: string;
  html: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function getUtcDateString(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function getDaysRemainingUtc(date: string, today: string): number {
  const target = Date.parse(`${date}T00:00:00.000Z`);
  const current = Date.parse(`${today}T00:00:00.000Z`);

  return Math.round((target - current) / DAY_MS);
}

export function getReminderLogKey(identity: ReminderLogIdentity): string {
  return [
    identity.userId,
    identity.deadlineId,
    identity.channel,
    identity.reminderDaysBefore,
    identity.sentOn,
  ].join(":");
}

export function getDueDeadlineReminders(
  deadlines: DeadlineReminderSource[],
  now = new Date(),
  existingLogKeys = new Set<string>(),
): DueDeadlineReminder[] {
  const today = getUtcDateString(now);

  return deadlines.flatMap((deadline) => {
    if (!deadline.notify_by_email || !deadline.email) {
      return [];
    }

    const daysRemaining = getDaysRemainingUtc(deadline.date, today);
    if (daysRemaining < 0 || !deadline.reminder_days?.includes(daysRemaining)) {
      return [];
    }

    const logKey = getReminderLogKey({
      userId: deadline.user_id,
      deadlineId: deadline.id,
      channel: "email",
      reminderDaysBefore: daysRemaining,
      sentOn: today,
    });

    if (existingLogKeys.has(logKey)) {
      return [];
    }

    return [{
      userId: deadline.user_id,
      deadlineId: deadline.id,
      to: deadline.email,
      title: deadline.title,
      date: deadline.date,
      note: deadline.note,
      daysRemaining,
      sentOn: today,
    }];
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getTodayAdvice(daysRemaining: number): string {
  if (daysRemaining === 0) {
    return "今天先完成提交或交付动作，并预留时间检查文件、链接和备注。";
  }

  if (daysRemaining <= 1) {
    return "今天先完成最终版本，晚上前只做检查和补漏。";
  }

  if (daysRemaining <= 3) {
    return "今天先拆出最后三个关键步骤，至少完成最难的一步。";
  }

  return "今天先确认范围和资料，把任务拆成可以每天推进的小块。";
}

export function buildDeadlineEmail(input: {
  to: string;
  title: string;
  date: string;
  note: string;
  daysRemaining: number;
}): DeadlineEmail {
  const remainingText = input.daysRemaining === 0 ? "今天截止" : `剩余 ${input.daysRemaining} 天`;
  const advice = getTodayAdvice(input.daysRemaining);

  return {
    to: input.to,
    subject: `DDL 提醒：${input.title}（${remainingText}）`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.7; color: #1f2933;">
        <h2 style="margin: 0 0 16px;">DDL 提醒</h2>
        <p><strong>DDL 名称：</strong>${escapeHtml(input.title)}</p>
        <p><strong>截止日期：</strong>${escapeHtml(input.date)}</p>
        <p><strong>剩余天数：</strong>${escapeHtml(remainingText)}</p>
        <p><strong>备注：</strong>${escapeHtml(input.note || "无")}</p>
        <p><strong>今日建议：</strong>${escapeHtml(advice)}</p>
      </div>
    `,
  };
}
