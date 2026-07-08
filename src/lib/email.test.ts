import { describe, expect, it } from "vitest";
import { getSmtpConfig } from "./email";

describe("getSmtpConfig", () => {
  it("parses SMTP environment variables", () => {
    expect(
      getSmtpConfig({
        SMTP_HOST: "smtp.qq.com",
        SMTP_PORT: "465",
        SMTP_SECURE: "true",
        SMTP_USER: "user@qq.com",
        SMTP_PASS: "authorization-code",
        EMAIL_FROM: "DDL Reminder <user@qq.com>",
      }),
    ).toEqual({
      host: "smtp.qq.com",
      port: 465,
      secure: true,
      user: "user@qq.com",
      pass: "authorization-code",
      from: "DDL Reminder <user@qq.com>",
    });
  });

  it("requires every SMTP variable", () => {
    expect(() => getSmtpConfig({ SMTP_HOST: "smtp.qq.com" })).toThrow("SMTP service is not configured");
  });
});
