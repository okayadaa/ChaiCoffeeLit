import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    if (
      !body ||
      typeof body.token !== "string" ||
      body.token.length > 256
    ) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    const subscriberId = verifyUnsubscribeToken(
      body.token
    );

    if (!subscriberId) {
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { error } = await supabase
      .from("subscribers")
      .update({ status: "unsubscribed" })
      .eq("id", subscriberId)
      .in("status", ["active", "pending"]);

    if (error) {
      console.error("Unsubscribe error:", error);

      return NextResponse.json(
        { error: "Unable to unsubscribe" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "You have been unsubscribed.",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);

    return NextResponse.json(
      { error: "Unable to process request" },
      { status: 500 }
    );
  }
}
