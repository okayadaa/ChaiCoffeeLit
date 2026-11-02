
import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Not available" },
      { status: 404 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const testEmail = process.env.TEST_EMAIL;

  if (!apiKey || !testEmail) {
    return NextResponse.json(
      { error: "Missing email configuration" },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: "Chai Coffee Lit <notifications@mail.chaicoffeelit.org>",
    to: [testEmail],
    subject: "Chai Coffee Lit — Test Email ☕",
    text: "Your Chai Coffee Lit email integration is working!",
  });

  if (error) {
    console.error("Resend error:", error);

    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    emailId: data?.id,
  });
}
