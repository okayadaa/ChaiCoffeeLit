import "server-only";

import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

function getSecret() {
  const secret = process.env.UNSUBSCRIBE_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("UNSUBSCRIBE_SECRET is not configured");
  }

  return secret;
}

export function createUnsubscribeToken(
  subscriberId: string
) {
  const signature = createHmac("sha256", getSecret())
    .update(`unsubscribe:${subscriberId}`)
    .digest("hex");

  return `${subscriberId}.${signature}`;
}

export function verifyUnsubscribeToken(
  token: string
): string | null {
  const parts = token.split(".");

  if (parts.length !== 2) return null;

  const [subscriberId, signature] = parts;

  if (
    !/^[0-9a-f-]{36}$/i.test(subscriberId) ||
    !/^[0-9a-f]{64}$/i.test(signature)
  ) {
    return null;
  }

  const expected = createHmac("sha256", getSecret())
    .update(`unsubscribe:${subscriberId}`)
    .digest();

  const provided = Buffer.from(signature, "hex");

  if (
    expected.length !== provided.length ||
    !timingSafeEqual(expected, provided)
  ) {
    return null;
  }

  return subscriberId;
}
