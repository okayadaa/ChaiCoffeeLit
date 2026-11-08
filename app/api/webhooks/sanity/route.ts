import { NextResponse } from "next/server";
import { isValidSignature } from "@sanity/webhook";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type BlogWebhookPayload = {
  _id: string;
  title: string;
  slug?: string;
  publishedAt?: string;
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
      !payload._id.trim() ||
      payload._id.startsWith("drafts.") ||
      typeof payload.title !== "string" ||
      !payload.title.trim()
    ) {
  return NextResponse.json(
    { error: "Invalid blog post payload" },
    { status: 400 }
  );
}

    console.log("Verified Sanity webhook:", {
      id: payload._id,
      title: payload.title,
    });

const publishedAt = payload.publishedAt;


const postSlug =
  typeof payload.slug === "string"
    ? payload.slug.trim()
    : "";

if (
  !postSlug ||
  !publishedAt ||
  !Number.isFinite(Date.parse(publishedAt))
) {
  console.log("Skipping post with missing publication details");

  return NextResponse.json({
    success: true,
    skipped: true,
    reason: "Missing publication details",
  });
}

if (new Date(publishedAt).getTime() > Date.now()) {
  console.log("Skipping future-dated post:", payload._id);

  return NextResponse.json({
    success: true,
    skipped: true,
    reason: "Future publication date",
  });
}

const supabase = getSupabaseAdmin();

const { data, error } = await supabase
  .from("blog_notifications")
  .upsert(
    {
      post_id: payload._id,
      post_title: payload.title,
      post_slug: postSlug,
      status: "pending",
    },
    {
      onConflict: "post_id",
      ignoreDuplicates: true,
    }
  )
  .select("id, post_id, post_slug, status");

if (error) {
  console.error("Failed to register blog notification:", error);

  return NextResponse.json(
    { error: "Failed to register notification" },
    { status: 500 }
  );
}

  console.log(
    data?.length
      ? "Registered new blog notification"
      : "Notification already registered",
    payload._id
  );

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
