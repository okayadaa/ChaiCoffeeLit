import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { Resend } from "resend";
import { createBlogNotificationEmail } from "@/lib/blog-notification-email";
type BlogNotification = {
  id: string;
  post_id: string;
  post_title: string;
  status: string;
};

export async function claimNextBlogNotification() {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "claim_blog_notification"
  );
  if (error) {
    throw new Error(
      `Failed to claim notification: ${error.message}`
    );
  }
const notification =
    (data?.[0] as BlogNotification | undefined) ?? null;
  if (!notification) {
    return {
      claimed: false,
      notification: null,
    };
  }
  console.log("Claimed blog notification:", {
    id: notification.id,
    postId: notification.post_id,
    title: notification.post_title,
    status: notification.status,
  });
  return {
    claimed: true,
    notification,
  };
}
export async function prepareNotificationDeliveries(
notificationId: string
  ) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
      "prepare_blog_notification_deliveries",
      {
        p_notification_id: notificationId,
      }
    );
    if (error) {
      throw new Error(
        `Failed to prepare notification deliveries: ${error.message}`
      );
    }
    console.log("Prepared blog notification deliveries:", {
      notificationId,
      insertedCount: data,
    });
    return {
      notificationId,
      insertedCount: Number(data ?? 0),
    };
  }
export async function claimTestNotificationDelivery(
deliveryId: string,
subscriberId: string
) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "claim_test_blog_notification_delivery",
    {
      p_delivery_id: deliveryId,
      p_subscriber_id: subscriberId,
    }
  );
  if (error) {
    throw new Error(
      `Failed to claim test delivery: ${error.message}`
    );
  }
const delivery = data?.[0] ?? null;
  if (!delivery) {
    return {
      claimed: false,
      delivery: null,
    };
  }
  return {
    claimed: true,
    delivery,
  };
}

export async function completeNotificationDelivery(
deliveryId: string,
resendEmailId: string
) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "complete_blog_notification_delivery",
    {
      p_delivery_id: deliveryId,
      p_resend_email_id: resendEmailId,
    }
  );
  if (error) {
    throw new Error(
      `Failed to complete delivery: ${error.message}`
    );
  }
const delivery = data?.[0];
  if (!delivery) {
    throw new Error(
      "Delivery was not completed. Check its current status."
    );
  }
  if (
    delivery.id !== deliveryId ||
    delivery.status !== "sent" ||
    delivery.resend_email_id !== resendEmailId.trim() ||
    !delivery.sent_at
  ) {
    throw new Error(
      "Delivery completion returned unexpected values; manual review required"
    );
  }
  return {
    deliveryId: delivery.id,
    status: delivery.status,
    resendEmailId: delivery.resend_email_id,
    sentAt: delivery.sent_at,
  };
}
export async function authorizeTestDeliverySend(
deliveryId: string,
subscriberId: string
) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "authorize_test_blog_delivery_send",
    {
      p_delivery_id: deliveryId,
      p_subscriber_id: subscriberId,
    }
  );
  if (error) {
    throw new Error(
      `Failed to authorize delivery: ${error.message}`
    );
  }
  return data?.[0] ?? null;
}
export async function sendAuthorizedTestDelivery() {
  if (process.env.NODE_ENV !== "development") {
    throw new Error("Test sending is development-only");
  }
const testEmail = process.env.TEST_EMAIL;
const apiKey = process.env.RESEND_API_KEY;
  if (!testEmail || !apiKey) {
    throw new Error("Missing test email configuration");
  }
const supabase = getSupabaseAdmin();
  // 1. Find only our active test subscriber.
const { data: subscriber, error: subscriberError } =
    await supabase
      .from("subscribers")
      .select("id, email")
      .eq("email", testEmail)
      .eq("status", "active")
      .single();
  if (subscriberError || !subscriber) {
    throw new Error("Active test subscriber not found");
  }
  // 2. Find the test notification.
const { data: notification, error: notificationError } =
    await supabase
      .from("blog_notifications")
      .select("id, post_title, post_slug, status")
      .eq("post_slug", "notification-test")
      .eq("status", "processing")
      .single();
  if (notificationError || !notification) {
    throw new Error("Processing test notification not found");
  }
  // 3. Find the already-claimed delivery.
const { data: delivery, error: deliveryError } =
    await supabase
      .from("blog_notification_deliveries")
      .select("id, status, send_started_at")
      .eq("notification_id", notification.id)
      .eq("subscriber_id", subscriber.id)
      .eq("status", "processing")
      .single();
  if (deliveryError || !delivery) {
    throw new Error("Processing test delivery not found");
  }
  if (delivery.send_started_at !== null) {
    throw new Error(
      "A send was already started for this delivery"
    );
  }
  // 4. Prepare the email before authorizing the send.
const email = createBlogNotificationEmail({
    subscriberId: subscriber.id,
    postTitle: notification.post_title,
    postSlug: notification.post_slug,
  });
  // 5. Atomically authorize this delivery.
const authorized = await authorizeTestDeliverySend(
    delivery.id,
    subscriber.id
  );
  if (!authorized) {
    throw new Error(
      "Delivery already authorized or no longer eligible"
    );
  }
  // 5b.
const { data: attempt, error: attemptError } =
    await supabase
      .from("blog_notification_send_attempts")
      .select("idempotency_key, status")
      .eq("delivery_id", delivery.id)
      .single();
  if (attemptError || !attempt) {
    throw new Error(
      "Authorized send attempt not found; manual review required"
    );
  }
  if (attempt.status !== "authorized") {
    throw new Error(
      "Send attempt is not in the authorized state"
    );
  }
  // 6. Send exactly one request to Resend.
const resend = new Resend(apiKey);
const { data, error } = await resend.emails.send(
    {
      from: email.from,
      to: subscriber.email,
      subject: email.subject,
      text: email.text,
    },
    {
      idempotencyKey: attempt.idempotency_key,
    }
  );
  if (error || !data?.id) {
    throw new Error(
      "Resend acceptance not confirmed; manual review required"
    );
  }
  // 7. Record Resend's accepted email ID.
let completed;
  try {
    completed = await completeNotificationDelivery(
      delivery.id,
      data.id
    );
  } catch (error) {
    logDeliveryCompletionFailure(delivery.id, data.id, error);
    try {
      const preserved = await recordAcceptanceEvidence(
        delivery.id,
        data.id
      );
      if (!preserved) {
        console.error(
          "[Blog Notification] Acceptance evidence was not saved",
          {
            deliveryId: delivery.id,
            resendEmailId: data.id,
          }
        );
      }
    } catch (evidenceError) {
      console.error(
        "[Blog Notification] Evidence persistence failed",
        {
          deliveryId: delivery.id,
          resendEmailId: data.id,
          error:
            evidenceError instanceof Error
              ? evidenceError.message
              : "Unknown error",
        }
      );
    }
    throw new Error(
      "Resend accepted the email, but database completion " +
        "could not be confirmed. Manual review required."
    );
  }
  return {
    success: true,
    deliveryId: completed.deliveryId,
    resendEmailId: completed.resendEmailId,
    status: completed.status,
  };
}
function logDeliveryCompletionFailure(
deliveryId: string,
resendEmailId: string,
error: unknown
) {
const message =
error instanceof Error
      ? error.message
      : "Unknown completion error";
  console.error(
    "[Blog Notification] Resend accepted an email, " +
      "but database completion failed",
    {
      deliveryId,
      resendEmailId,
      error: message,
    }
  );
}

export async function recoverUnstartedDeliveries(
olderThanMinutes = 15
) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "recover_unstarted_blog_deliveries",
    {
      p_older_than_minutes: olderThanMinutes,
    }
  );
  if (error) {
    throw new Error(
      `Failed to recover deliveries: ${error.message}`
    );
  }
  return {
    recoveredCount: data ?? 0,
  };
}

export async function flagUncertainDeliveries(
olderThanMinutes = 15
) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "flag_uncertain_blog_deliveries",
    {
      p_older_than_minutes: olderThanMinutes,
    }
  );
  if (error) {
    throw new Error(
      `Failed to flag uncertain deliveries: ${error.message}`
    );
  }
  return {
    flaggedCount: data ?? 0,
  };
}

export async function reconcileNotificationDelivery(
deliveryId: string,
verifiedResendEmailId: string
) {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "reconcile_blog_notification_delivery",
    {
      p_delivery_id: deliveryId,
      p_resend_email_id: verifiedResendEmailId,
    }
  );
  if (error) {
    throw new Error(
      `Failed to reconcile delivery: ${error.message}`
    );
  }
const delivery = data?.[0];
  if (!delivery) {
    throw new Error(
      "Delivery was not eligible for reconciliation"
    );
  }
  return {
    deliveryId: delivery.id,
    status: delivery.status,
    resendEmailId: delivery.resend_email_id,
    sentAt: delivery.sent_at,
  };
}

export async function recordAcceptanceEvidence(
deliveryId: string,
resendEmailId: string
): Promise<boolean> {
const supabase = getSupabaseAdmin();
const { data, error } = await supabase.rpc(
    "record_blog_notification_acceptance_evidence",
    {
      p_delivery_id: deliveryId,
      p_resend_email_id: resendEmailId,
    }
  );
  if (error) {
    throw new Error(
      `Failed to preserve acceptance evidence: ${error.message}`
    );
  }
  return data === true;
}

export async function claimProductionDelivery() {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc(
    "claim_blog_notification_delivery"
  );

  if (error) {
    throw new Error(
      `Failed to claim production delivery: ${error.message}`
    );
  }

  const delivery = data?.[0] ?? null;

  return {
    claimed: delivery !== null,
    delivery,
  };
}

export async function authorizeProductionDeliverySend(
  deliveryId: string
) {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc(
    "authorize_blog_notification_delivery_send",
    {
      p_delivery_id: deliveryId,
    }
  );

  if (error) {
    throw new Error(
      `Failed to authorize production delivery: ${error.message}`
    );
  }

  const authorization = data?.[0] ?? null;

  if (!authorization) {
    return {
      authorized: false as const,
      idempotencyKey: null,
    };
  }

  if (
    authorization.delivery_id !== deliveryId ||
    typeof authorization.idempotency_key !== "string" ||
    !authorization.idempotency_key
  ) {
    throw new Error(
      "Unexpected authorization result; manual review required"
    );
  }

  return {
    authorized: true as const,
    idempotencyKey: authorization.idempotency_key,
  };
}

export async function previewProductionBatch(batchSize = 3) {
  const supabase = getSupabaseAdmin();

  const safeBatchSize = Math.min(
    Math.max(Math.trunc(batchSize), 1),
    5
  );

  const { data, error } = await supabase
    .from("blog_notification_deliveries")
    .select(`
      id,
      attempt_count,
      subscriber:subscribers!inner(status),
      notification:blog_notifications!inner(status)
    `)
    .eq("status", "pending")
    .eq("subscribers.status", "active")
    .eq("blog_notifications.status", "processing")
    .is("send_started_at", null)
    .is("resend_email_id", null)
    .order("created_at", { ascending: true })
    .limit(safeBatchSize);

  if (error) {
    throw new Error(
      `Failed to preview production batch: ${error.message}`
    );
  }

  return {
    mode: "dry-run" as const,
    batchSize: safeBatchSize,
    candidateDeliveryIds: (data ?? []).map(
      (delivery) => delivery.id
    ),
    emailsSent: 0,
    deliveriesClaimed: 0,
  };
}

export function isProductionSendingEnabled(): boolean {
  return (
    process.env.BLOG_NOTIFICATION_SENDING_ENABLED === "true"
  );
}

export async function processProductionNotificationBatch(
  requestedBatchSize = 3
) {
  const batchSize = Math.min(
    Math.max(Math.trunc(requestedBatchSize) || 1, 1),
    3
  );

  // Never claim deliveries while sending is disabled.
  if (!isProductionSendAuthorized()) {
    return {
      ...(await previewProductionBatch(batchSize)),
      sendingEnabled: false,
    };
  }


  // Claim a newly published notification and prepare
  // deliveries for active subscribers.
  const pendingNotification = await claimNextBlogNotification();

  if (pendingNotification.claimed && pendingNotification.notification) {
    await prepareNotificationDeliveries(
      pendingNotification.notification.id
    );
  }

  // Recover deliveries claimed but never authorized for sending.
  const recovery = await recoverUnstartedDeliveries(15);

// Flag uncertain sends for manual review.
// Never automatically retry these deliveries.
  const uncertain = await flagUncertainDeliveries(15);

  console.log("[Blog Notification] Recovery:", {
    recovered: recovery.recoveredCount,
    flaggedForReview: uncertain.flaggedCount,
  });

  const results: Array<{
    deliveryId?: string;
    claimed: boolean;
    emailsSent: number;
    success: boolean;
    error?: string;
  }> = [];

  for (let i = 0; i < batchSize; i++) {
    // Stop if sending is disabled during processing.
    if (!isProductionSendAuthorized()) {
      break;
    }

    try {
      const result = await sendProductionDelivery();

      if (!result.claimed) {
        break;
      }

      results.push({
        deliveryId: result.deliveryId,
        claimed: true,
        emailsSent: result.emailsSent,
        success: result.success,
      });
    } catch (error) {
      console.error(
        "[Blog Notification] Production delivery failed:",
        error
      );

      // Stop the batch on any uncertain outcome.
      // Never automatically retry the same delivery.
      results.push({
        claimed: false,
        emailsSent: 0,
        success: false,
        error: "Delivery processing requires review",
      });

      break;
    }
  }

  
    const failedDeliveries = results.filter(
      (result) => !result.success).length;

  return {
    mode: "production" as const,
    sendingEnabled: true,
    batchSize,
    success: failedDeliveries === 0,
    deliveriesProcessed: results.length,
    failedDeliveries,
    emailsSent: results.reduce(
      (total, result) => total + result.emailsSent,
      0
    ),
    results,
  };
}

export function isProductionSendAuthorized(): boolean {
  return (
    process.env.BLOG_NOTIFICATION_SENDING_ENABLED === "true" &&
    process.env.BLOG_NOTIFICATION_SEND_APPROVED === "true"
  );
}

export async function sendProductionDelivery() {
  // Never claim a delivery unless both flags are enabled.
  if (!isProductionSendAuthorized()) {
    throw new Error("Production sending is disabled");
  }

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const supabase = getSupabaseAdmin();

  // 1. Claim one eligible delivery.
  const claim = await claimProductionDelivery();

  if (!claim.claimed || !claim.delivery) {
    return {
      success: true,
      claimed: false,
      emailsSent: 0,
    };
  }

  const delivery = claim.delivery;

  // 2. Retrieve subscriber and notification details.
  const { data: subscriber, error: subscriberError } =
    await supabase
      .from("subscribers")
      .select("id, email, status")
      .eq("id", delivery.subscriber_id)
      .single();

  const { data: notification, error: notificationError } =
    await supabase
      .from("blog_notifications")
      .select("id, post_title, post_slug, status")
      .eq("id", delivery.notification_id)
      .single();

  if (
    subscriberError ||
    notificationError ||
    !subscriber ||
    !notification
  ) {
    throw new Error(
      "Unable to load delivery details; recovery review required"
    );
  }

  if (
    subscriber.status !== "active" ||
    notification.status !== "processing"
  ) {
    throw new Error(
      "Delivery is no longer eligible; no email sent"
    );
  }

  // 3. Prepare the email before authorization.
  const email = createBlogNotificationEmail({
    subscriberId: subscriber.id,
    postTitle: notification.post_title,
    postSlug: notification.post_slug,
  });

  // 4. Authorize the send atomically in PostgreSQL.
  const authorization = await authorizeProductionDeliverySend(
    delivery.id
  );

  if (
    !authorization.authorized ||
    !authorization.idempotencyKey
  ) {
    throw new Error(
      "Delivery authorization refused; no email sent"
    );
  }

  // 5. Recheck subscriber status immediately before sending.
  const { data: latestSubscriber, error: latestError } =
    await supabase
      .from("subscribers")
      .select("status")
      .eq("id", subscriber.id)
      .single();

  if (latestError || latestSubscriber?.status !== "active") {
    throw new Error(
      "Subscriber is no longer active; authorized send not executed"
    );
  }

  // 6. Send once using the persistent idempotency key.
  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send(
    {
      from: email.from,
      to: subscriber.email,
      subject: email.subject,
      text: email.text,
    },
    {
      idempotencyKey: authorization.idempotencyKey,
    }
  );

  if (error || !data?.id) {
    throw new Error(
      "Resend acceptance could not be confirmed; manual review required"
    );
  }

  // 7. Complete the delivery in PostgreSQL.
  try {
    const completed = await completeNotificationDelivery(
      delivery.id,
      data.id
    );

    return {
      success: true,
      claimed: true,
      emailsSent: 1,
      deliveryId: completed.deliveryId,
      resendEmailId: completed.resendEmailId,
    };
  } catch (completionError) {
    console.error(
      "Resend accepted email but completion failed:",
      completionError
    );

    // Preserve evidence without resending.
    try {
      await recordAcceptanceEvidence(delivery.id, data.id);
    } catch (evidenceError) {
      console.error(
        "Unable to preserve Resend acceptance evidence:",
        evidenceError
      );
    }

    throw new Error(
      "Email accepted by Resend, but database completion " +
        "could not be confirmed. Manual review required."
    );
  }
}






