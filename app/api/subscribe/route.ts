import { NextResponse } from "next/server";
import { Resend } from "resend";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { subscribeRateLimit } from "@/lib/rate-limit";
import { generateConfirmationToken } from "@/lib/subscription-token";

const genericMessage =
  "If this email is eligible, you'll receive a confirmation email shortly.";

export async function POST(request: Request) {
  try {
    // 1. Rate limiting
    // Local-only identifier for development.
    // Production requires a trusted client IP.
    const ip =
      process.env.NODE_ENV === "development"
        ? "local-development"
        : request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

    if (!ip) {
      return NextResponse.json(
        { error: "Unable to verify request source" },
        { status: 503 }
      );
    }

    const { success, reset } =
      await subscribeRateLimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(1, Math.ceil((reset - Date.now()) / 1000))
            ),
          },
        }
      );
    }

    // 2. Validate email
    const body = await request.json();

    if (!body || typeof body.email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    if (
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "Enter a valid email address" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    // 3. Insert only if email does not already exist
    const { error: insertError } = await supabase
      .from("subscribers")
      .upsert(
        { email, status: "pending" },
        {
          onConflict: "email",
          ignoreDuplicates: true,
        }
      );

    if (insertError) {
      console.error("Subscriber insert error:", insertError);
      return NextResponse.json(
        { error: "Unable to process subscription" },
        { status: 500 }
      );
    }

    // 4. Retrieve subscriber
    const { data: subscriber, error: lookupError } =
      await supabase
        .from("subscribers")
        .select("id, status")
        .eq("email", email)
        .single();

    if (lookupError || !subscriber) {
      console.error("Subscriber lookup error:", lookupError);
      return NextResponse.json(
        { error: "Unable to process subscription" },
        { status: 500 }
      );
    }

    // 5. Do not email already-active or unsubscribed users
    if (subscriber.status !== "pending") {
      return NextResponse.json({
        message: genericMessage,
      });
    }

    // 6. Generate secure token
    const { token, tokenHash } =
      generateConfirmationToken();

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    // 7. Store token hash in Supabase
    const { error: tokenError } = await supabase
      .from("subscription_tokens")
      .insert({
        subscriber_id: subscriber.id,
        token_hash: tokenHash,
        expires_at: expiresAt,
      });

    if (tokenError) {
      console.error("Token storage error:", tokenError);
      return NextResponse.json(
        { error: "Unable to process subscription" },
        { status: 500 }
      );
    }

    // 8. Construct confirmation link
    const siteUrl = process.env.SITE_URL;
    const resendKey = process.env.RESEND_API_KEY;

    if (!siteUrl || !resendKey) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { error: "Email configuration unavailable" },
        { status: 500 }
      );
    }

    const confirmUrl = new URL(
      "/confirm-subscription",
      siteUrl
    );

    confirmUrl.searchParams.set("token", token);

    // 9. Send confirmation email
    const resend = new Resend(resendKey);

    const { error: emailError } =
      await resend.emails.send({
        from:
          "Chai Coffee Lit <notifications@mail.chaicoffeelit.org>",
        to: [email],
        subject: "Confirm your Chai Coffee Lit subscription ☕",
        text:
          "Welcome to Chai Coffee Lit!\n\n" +
          "Please confirm your email address:\n\n" +
          confirmUrl.toString() +
          "\n\nThis link expires in 24 hours.\n\n" +
          "If you didn't subscribe, you can ignore this email.",
      });

    if (emailError) {
      console.error("Resend confirmation error:", emailError);
      return NextResponse.json(
        { error: "Unable to send confirmation email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: genericMessage,
    });
  } catch (error) {
    console.error("Subscription error:", error);

    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
