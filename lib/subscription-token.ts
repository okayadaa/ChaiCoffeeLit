import "server-only";

import { randomBytes, createHash } from "node:crypto";

export function generateConfirmationToken() {
  const token = randomBytes(32).toString("hex");

  const tokenHash = createHash("sha256")
    .update(token)
    .digest("hex");

  return { token, tokenHash };
}

export function hashConfirmationToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}
