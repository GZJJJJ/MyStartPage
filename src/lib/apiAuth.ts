export function getBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length);
}

export function isCronRequestAuthorized(authorizationHeader: string | null, cronSecret: string | undefined): boolean {
  if (!cronSecret) {
    return false;
  }

  return getBearerToken(authorizationHeader) === cronSecret;
}
