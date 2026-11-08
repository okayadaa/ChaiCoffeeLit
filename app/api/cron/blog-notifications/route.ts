import { NextRequest, NextResponse } from "next/server";
import { processProductionNotificationBatch } from "@/lib/blog-notification-worker";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { error: "Cron secret is not configured" },
      { status: 503 }
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const result = await processProductionNotificationBatch(3);

    return NextResponse.json({
      ...result,
      success: result.success ?? true,
    });
  } catch (error) {
    console.error("Notification worker failed:", error);

    return NextResponse.json(
      { error: "Notification processing failed" },
      { status: 500 }
    );
  }
}
