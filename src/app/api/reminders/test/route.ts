import { getBearerToken } from "@/lib/apiAuth";
import { buildDeadlineEmail } from "@/lib/deadlineReminders";
import { sendDeadlineEmail } from "@/lib/email";
import { createServerSupabaseClient, createServiceSupabaseClient } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<Response> {
  const token = getBearerToken(request.headers.get("authorization"));

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const authClient = createServerSupabaseClient(token);
    const { data: userData, error: userError } = await authClient.auth.getUser(token);

    if (userError || !userData.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const serviceClient = createServiceSupabaseClient();
    const { data: settings, error: settingsError } = await serviceClient
      .from("settings")
      .select("email")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (settingsError) {
      throw new Error(settingsError.message);
    }

    const recipient = (settings as { email?: string | null } | null)?.email ?? userData.user.email;

    if (!recipient) {
      return Response.json({ error: "当前用户没有可用邮箱" }, { status: 400 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const email = buildDeadlineEmail({
      to: recipient,
      title: "测试 DDL 提醒",
      date: today,
      note: "这是一封测试邮件，用于验证邮件服务配置。",
      daysRemaining: 0,
    });

    const providerId = await sendDeadlineEmail(email);

    return Response.json({ ok: true, providerId });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "测试邮件发送失败" },
      { status: 500 },
    );
  }
}
