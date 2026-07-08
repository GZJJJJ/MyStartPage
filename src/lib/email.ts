import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { DeadlineEmail } from "./deadlineReminders";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  from: string;
};

type EmailEnv = Record<string, string | undefined>;

function requireEnv(value: string | undefined): string {
  if (!value?.trim()) {
    throw new Error("SMTP service is not configured");
  }

  return value.trim();
}

export function getSmtpConfig(env: EmailEnv = process.env): SmtpConfig {
  const host = requireEnv(env.SMTP_HOST);
  const port = Number(requireEnv(env.SMTP_PORT));

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP service is not configured");
  }

  return {
    host,
    port,
    secure: requireEnv(env.SMTP_SECURE).toLowerCase() === "true",
    user: requireEnv(env.SMTP_USER),
    pass: requireEnv(env.SMTP_PASS),
    from: requireEnv(env.EMAIL_FROM),
  };
}

export async function sendDeadlineEmail(email: DeadlineEmail): Promise<string | null> {
  const config = getSmtpConfig();
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  const result = await transport.sendMail({
    from: config.from,
    to: email.to,
    subject: email.subject,
    html: email.html,
  });

  return (result as SMTPTransport.SentMessageInfo).messageId ?? null;
}
