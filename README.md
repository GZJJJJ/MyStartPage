# My Start Page

个人浏览器启动页 Web App。技术栈为 Next.js、TypeScript、Tailwind CSS、Supabase Auth、Supabase Postgres、Vercel Cron。数据仍优先保存在浏览器 `localStorage`，登录后再同步到云端。

## 功能

- 当前日期、星期、时间实时显示
- 搜索框支持百度、Google、GitHub、B站
- 常用网站快捷入口：新增、编辑、删除、打开
- 今日任务：添加、完成、删除、每天邮件提醒开关
- DDL 倒计时：事件名称、日期、备注、提醒天数、邮件提醒开关、微信提醒预留字段
- 随机决定器：每行一个选项，随机抽取
- 深色模式，刷新后保持
- JSON 数据导出和导入，格式继续使用 `version: 1`
- Supabase Auth 登录 / 注册 / 退出登录
- Supabase Postgres 云同步，`localStorage` 作为本地缓存
- Vercel Cron 每天检查 DDL 和未完成待办并发送邮件提醒

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

默认地址：

```text
http://localhost:3000
```

## 环境变量

```env
NEXT_PUBLIC_SUPABASE_URL=你的 Supabase Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 Supabase publishable/anon key
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service role/secret key
CRON_SECRET=至少 16 位随机字符串
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ邮箱@qq.com
SMTP_PASS=QQ邮箱生成的SMTP授权码
EMAIL_FROM=DDL Reminder <你的QQ邮箱@qq.com>
```

要点：

- `NEXT_PUBLIC_SUPABASE_*` 会进入前端，只放 Supabase URL 和 publishable/anon key。
- `SUPABASE_SERVICE_ROLE_KEY` 只在 API route 中使用，不要加 `NEXT_PUBLIC_`。
- `CRON_SECRET` 会被 Vercel Cron 自动作为 `Authorization: Bearer ...` 发送。
- 邮件服务当前按 SMTP 接入。没有个人域名时，第一版建议用 QQ 邮箱授权码；`SMTP_PASS` 不是邮箱登录密码。

QQ 邮箱 SMTP 推荐配置：

```env
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=你的QQ邮箱@qq.com
SMTP_PASS=QQ邮箱设置里生成的授权码
EMAIL_FROM=DDL Reminder <你的QQ邮箱@qq.com>
```

Outlook SMTP 可尝试配置：

```env
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=你的Outlook邮箱
SMTP_PASS=你的Outlook应用密码或可用认证凭据
EMAIL_FROM=DDL Reminder <你的Outlook邮箱>
```

Outlook 账号可能要求 Modern Auth，普通密码式 SMTP 不一定可用；QQ 邮箱授权码更适合第一版。

## 创建 Supabase 项目

1. 在 Supabase 新建项目。
2. 打开 Project Settings → API，复制 Project URL 和 publishable/anon key。
3. 复制 service role/secret key，只放到服务端环境变量。
4. 打开 Authentication → Providers，启用 Email provider。
5. 如果希望注册后立刻登录，可在 Supabase Auth 设置里关闭 Confirm email；否则用户需要先点验证邮件。

## 初始化数据库

在 Supabase SQL Editor 中执行：

```text
supabase/schema.sql
```

脚本会创建并启用 RLS：

- `shortcuts`
- `tasks`
- `deadlines`
- `settings`
- `reminder_logs`

所有业务表都有 `user_id`。RLS policy 使用 `auth.uid() = user_id`，前端 anon key 只能访问当前登录用户自己的数据。Cron 和测试邮件 API 使用 service role key 在服务端执行。

## 数据同步策略

启动页加载顺序：

1. 先读取原来的 `localStorage` key：`my-start-page:data:v1`。
2. 如果已登录，再拉取 Supabase 云端数据。
3. 首次登录且云端为空时，会把当前本地数据一次性迁移到云端。
4. 用户修改数据时，先写 `localStorage`，再 debounce 同步到 Supabase。
5. JSON 导入导出仍使用 `version: 1`。旧 DDL 没有提醒字段也能导入，会自动补：`reminderDays: [7, 3, 1, 0]`、`notifyByEmail: true`、`notifyByWechat: false`。旧 task 会自动补 `notifyByEmail: false`、`notifyByWechat: false`，避免历史待办突然开始发提醒。

## Vercel 部署

1. 把项目导入 Vercel。
2. 在 Vercel Project Settings → Environment Variables 添加 `.env.example` 中的变量。
3. 部署后使用 Vercel 自动生成的 `https://你的项目.vercel.app` 即可。
4. 不需要购买自定义域名：Supabase Auth、API routes、Cron 都可以在 `.vercel.app` 域名下工作。后续只有在你想提升品牌感、邮件投递信誉或绑定企业域名时，才需要考虑自定义域名。

## 配置 Vercel Cron

项目根目录已经包含：

```json
{
  "crons": [
    {
      "path": "/api/cron/check-deadlines",
      "schedule": "0 0 * * *"
    }
  ]
}
```

Vercel Cron 使用 UTC 时间。`0 0 * * *` 表示每天 UTC 00:00 运行一次。Hobby plan 支持每天一次，符合第一版 DDL 提醒需求。

Cron route：

```text
/api/cron/check-deadlines
```

鉴权方式：

```http
Authorization: Bearer <CRON_SECRET>
```

Cron 会检查两类提醒：

- `deadlines.reminder_days`：如果某个 DDL 到达提醒天数且 `reminder_logs` 当天没有记录，就发送邮件并写入日志。
- `tasks.notify_by_email`：如果某个待办未完成、开启邮件提醒且当天没有记录，就发送一封待办提醒。

两类提醒都通过 `reminder_logs` 避免同一天重复发送。

## 测试邮件

登录后进入“数据”页面，点击“测试邮件提醒”。该按钮会调用：

```text
POST /api/reminders/test
```

前端会带当前 Supabase access token，API route 会校验用户身份，然后发送一封测试 DDL 邮件到 `settings.email` 或登录邮箱。

## 验证

```bash
npm run test
npm run lint
npm run build
```

注意：项目现在包含 API routes 和 Vercel Cron，不能再使用 `output: "export"` 静态导出模式。

## 数据库表结构摘要

`shortcuts`

- `user_id uuid`
- `id text`
- `name text`
- `url text`
- `created_at timestamptz`
- `updated_at timestamptz`

`tasks`

- `user_id uuid`
- `id text`
- `text text`
- `completed boolean`
- `notify_by_email boolean`
- `notify_by_wechat boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

`deadlines`

- `user_id uuid`
- `id text`
- `title text`
- `date date`
- `note text`
- `reminder_days integer[]`
- `notify_by_email boolean`
- `notify_by_wechat boolean`
- `created_at timestamptz`
- `updated_at timestamptz`

`settings`

- `user_id uuid`
- `note text`
- `decision_options text`
- `search_engine text`
- `email text`
- `migrated_at timestamptz`
- `created_at timestamptz`
- `updated_at timestamptz`

`reminder_logs`

- `id uuid`
- `user_id uuid`
- `deadline_id text`
- `channel text`
- `reminder_days_before integer`
- `sent_on date`
- `sent_at timestamptz`
- `recipient_email text`
- `email_provider_id text`
