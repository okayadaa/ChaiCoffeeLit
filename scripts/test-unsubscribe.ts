import { config } from "dotenv";
import { createHmac } from "node:crypto";

config({ path: ".env.local" });

const subscriberId = process.argv[2];
const secret = process.env.UNSUBSCRIBE_SECRET;

if (!subscriberId) {
  throw new Error("Please provide a subscriber ID");
}

if (
  !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    subscriberId
  )
) {
  throw new Error("Invalid subscriber UUID");
}

if (!secret || secret.length < 32) {
  throw new Error("UNSUBSCRIBE_SECRET is missing");
}

const signature = createHmac("sha256", secret)
  .update(`unsubscribe:${subscriberId}`)
  .digest("hex");

const token = `${subscriberId}.${signature}`;

const unsubscribeUrl = new URL(
  "/unsubscribe",
  "http://localhost:3000"
);

unsubscribeUrl.searchParams.set("token", token);

console.log("Test unsubscribe link:");
console.log(unsubscribeUrl.toString());
