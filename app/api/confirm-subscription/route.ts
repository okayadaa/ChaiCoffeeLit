import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { hashConfirmationToken } from "@/lib/subscription-token";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const token = body?.token;

    // Validate token before querying Supabase.
    if (
      typeof token !== "string" ||
      !/^[a-f0-9]{64}$/.test(token)
    ) {
      return NextResponse.json(
        { error: "Invalid confirmation token" },
        { status: 400 }
      );
    }

    const tokenHash = hashConfirmationToken(token);
    const supabase = getSupabaseAdmin();

    // Reuse our existing PostgreSQL confirmation function.
    const { data, error } = await supabase.rpc(
      "confirm_subscription",
      { provided_token_hash: tokenHash }
    );

    if (error) {
      console.error("Confirmation database error:", error);

      return NextResponse.json(
        { error: "Unable to confirm subscription" },
        { status: 500 }
      );
    }

    if (data !== true) {
      return NextResponse.json(
        { error: "Confirmation link is invalid or expired" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscription confirmed successfully",
    });
  } catch (error) {
    console.error("Confirmation error:", error);

    return NextResponse.json(
      { error: "Unable to confirm subscription" },
      { status: 500 }
    );
  }
}
