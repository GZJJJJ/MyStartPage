import { describe, expect, it } from "vitest";
import { getBearerToken, isCronRequestAuthorized } from "./apiAuth";

describe("getBearerToken", () => {
  it("extracts bearer tokens and rejects other schemes", () => {
    expect(getBearerToken("Bearer secret")).toBe("secret");
    expect(getBearerToken("Basic secret")).toBeNull();
    expect(getBearerToken(null)).toBeNull();
  });
});

describe("isCronRequestAuthorized", () => {
  it("requires an exact CRON_SECRET bearer token", () => {
    expect(isCronRequestAuthorized("Bearer cron-secret", "cron-secret")).toBe(true);
    expect(isCronRequestAuthorized("Bearer wrong", "cron-secret")).toBe(false);
    expect(isCronRequestAuthorized("Bearer cron-secret", undefined)).toBe(false);
  });
});
