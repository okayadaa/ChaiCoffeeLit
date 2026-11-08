import "server-only";

import { Resend } from "resend";

const EXPECTED_SENDER =
  "notifications@mail.chaicoffeelit.org";

export async function getResendEmailRecord(
  resendEmailId: string
) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const emailId = resendEmailId.trim();

  if (!emailId) {
    throw new Error("Resend email ID is required");
  }

  const resend = new Resend(apiKey);

  const { data, error } =
    await resend.emails.get(emailId);

  if (error || !data) {
    throw new Error(
      `Unable to retrieve Resend email: ${
        error?.message ?? "Unknown error"
      }`
    );
  }

  return {
    id: data.id,
    to: data.to,
    subject: data.subject,
    from: data.from,
    createdAt: data.created_at,
  };
}

export async function compareResendDelivery(
  deliveryId: string,
  resendEmailId: string
) {
  const { getSupabaseAdmin } = await import(
    "@/lib/supabase-admin"
  );

  const supabase = getSupabaseAdmin();

  const { data: delivery, error: deliveryError } =
    await supabase
      .from("blog_notification_deliveries")
      .select(`
        id,
        status,
        send_started_at,
        resend_email_id,
        subscriber_id,
        notification_id
      `)
      .eq("id", deliveryId)
      .single();

  if (deliveryError || !delivery) {
    throw new Error("Delivery not found");
  }

  const { data: subscriber, error: subscriberError } =
    await supabase
      .from("subscribers")
      .select("email")
      .eq("id", delivery.subscriber_id)
      .single();

  const { data: notification, error: notificationError } =
    await supabase
      .from("blog_notifications")
      .select("post_title")
      .eq("id", delivery.notification_id)
      .single();

  if (
    subscriberError ||
    notificationError ||
    !subscriber ||
    !notification
  ) {
    throw new Error(
      "Subscriber or notification not found"
    );
  }

  const record =
    await getResendEmailRecord(resendEmailId);

  const recipientMatches =
    record.to.length === 1 &&
    record.to[0].trim().toLowerCase() ===
      subscriber.email.trim().toLowerCase();

  const subjectMatches =
    record.subject ===
    `New on Chai Coffee Lit: ${notification.post_title}`;

  const senderMatches =
    record.from.trim().toLowerCase() ===
      `Chai Coffee Lit <${EXPECTED_SENDER}>`
        .toLowerCase();

  const emailIdMatches =
    record.id === resendEmailId.trim();

  const needsReview =
    delivery.status === "needs_review" &&
    delivery.send_started_at !== null &&
    delivery.resend_email_id === null;

  const sendStartedAt = delivery.send_started_at
    ? Date.parse(delivery.send_started_at)
    : NaN;

  const providerCreatedAt = Date.parse(
    record.createdAt
  );

  const timestampPlausible =
    Number.isFinite(sendStartedAt) &&
    Number.isFinite(providerCreatedAt) &&
    providerCreatedAt >= sendStartedAt - 60_000;

  const basicChecksPass =
    recipientMatches &&
    subjectMatches &&
    senderMatches &&
    emailIdMatches &&
    needsReview &&
    timestampPlausible;

  return {
    deliveryId,
    resendEmailId: record.id,
    deliveryStatus: delivery.status,
    recipientMatches,
    subjectMatches,
    senderMatches,
    emailIdMatches,
    timestampPlausible,
    basicChecksPass,

    // These checks do not prove that the provider
    // record belongs to this particular delivery.
    canAutomaticallyReconcile: false,
  };
}
