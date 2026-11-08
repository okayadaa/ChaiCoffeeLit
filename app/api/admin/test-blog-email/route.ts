import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createBlogNotificationEmail } from "@/lib/blog-notification-email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const secret = process.env.BLOG_NOTIFICATION_TEST_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret) {
    return NextResponse.json(
      { error: "Test endpoint is not configured" },
      { status: 503 }
    );
  }

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // This endpoint must never enable the production worker.
  if (
    process.env.BLOG_NOTIFICATION_SENDING_ENABLED === "true" ||
    process.env.BLOG_NOTIFICATION_SEND_APPROVED === "true"
  ) {
    return NextResponse.json(
      { error: "Disable production sending before testing" },
      { status: 409 }
    );
  }

  const testEmail = process.env.TEST_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!testEmail || !resendKey) {
    return NextResponse.json(
      { error: "Missing test configuration" },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: subscriber, error: subscriberError } =
    await supabase
      .from("subscribers")
      .select("id, email, status")
      .eq("email", testEmail)
      .eq("status", "active")
      .single();

  if (subscriberError || !subscriber) {
    return NextResponse.json(
      { error: "Active test subscriber not found" },
      { status: 404 }
    );
  }

  // Fixed test article: cannot be redirected to arbitrary posts.
  const email = createBlogNotificationEmail({
    subscriberId: subscriber.id,
    postTitle: "Chai Coffee Lit — Webhook Integration Test",
    postSlug: "chai-coffee-lit-webhook-integration-test",
  });

  const resend = new Resend(resendKey);

  const { data, error } = await resend.emails.send({
    from: email.from,
    to: subscriber.email,
    subject: `[TEST] ${email.subject}`,
    text: email.text,
  });

  if (error || !data?.id) {
    console.error("Controlled blog email test failed:", error);

    return NextResponse.json(
      { error: "Test email was not accepted by Resend" },
      { status: 502 }
    );
  }

  return NextResponse.json({
    success: true,
    mode: "single-recipient-test",
    emailsAccepted: 1,
    resendEmailId: data.id,
  });
}
