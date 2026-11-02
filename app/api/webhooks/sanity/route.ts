import { NextResponse } from "next/server";
import { isValidSignature } from "@sanity/webhook";

export const runtime = "nodejs";

type BlogWebhookPayload = {
  _id: string;
  title: string;
  slug?: string;
};

export async function POST(request: Request) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (!secret) {
      console.error("SANITY_WEBHOOK_SECRET is missing");

      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    const signature = request.headers.get(
      "sanity-webhook-signature"
    );

    if (!signature) {
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // Signature verification must use the raw request body.
    const rawBody = await request.text();

    const isValid = await isValidSignature(
      rawBody,
      signature,
      secret
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(
      rawBody
    ) as BlogWebhookPayload;

    if (
      typeof payload._id !== "string" ||
      typeof payload.title !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid payload" },
        { status: 400 }
      );
    }

    console.log("Verified Sanity webhook:", {
      id: payload._id,
      title: payload.title,
    });

    return NextResponse.json({
      success: true,
      message: "Webhook received",
    });
  } catch (error) {
    console.error("Sanity webhook error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
