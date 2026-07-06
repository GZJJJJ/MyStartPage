import { describe, expect, it } from "vitest";
import {
  createDefaultData,
  parseImportPayload,
  STORAGE_KEY,
  THEME_KEY,
} from "./storage";

describe("storage constants", () => {
  it("uses stable localStorage keys", () => {
    expect(STORAGE_KEY).toBe("my-start-page:data:v1");
    expect(THEME_KEY).toBe("my-start-page:theme:v1");
  });
});

describe("createDefaultData", () => {
  it("creates removable starter shortcuts and empty user modules", () => {
    const data = createDefaultData();

    expect(data.searchEngine).toBe("baidu");
    expect(data.shortcuts.map((item) => item.name)).toEqual(["百度", "Google", "GitHub", "B站"]);
    expect(data.tasks).toEqual([]);
    expect(data.deadlines).toEqual([]);
    expect(data.note).toBe("");
    expect(data.decisionOptions).toBe("");
  });
});

describe("parseImportPayload", () => {
  it("accepts version 1 export payloads", () => {
    const data = createDefaultData();
    const payload = JSON.stringify({
      version: 1,
      exportedAt: "2026-07-06T00:00:00.000Z",
      data,
    });

    expect(parseImportPayload(payload)).toEqual(data);
  });

  it("accepts old deadline records and fills reminder defaults", () => {
    const data = createDefaultData();
    const payload = JSON.stringify({
      version: 1,
      exportedAt: "2026-07-06T00:00:00.000Z",
      data: {
        ...data,
        deadlines: [
          {
            id: "ddl-old",
            title: "Old DDL",
            date: "2026-07-12",
            note: "legacy record",
            createdAt: "2026-07-06T00:00:00.000Z",
          },
        ],
      },
    });

    expect(parseImportPayload(payload).deadlines[0]).toMatchObject({
      id: "ddl-old",
      reminderDays: [7, 3, 1, 0],
      notifyByEmail: true,
      notifyByWechat: false,
    });
  });

  it("rejects invalid import payloads", () => {
    expect(() => parseImportPayload("{\"version\":2}")).toThrow("Invalid import file");
  });
});
