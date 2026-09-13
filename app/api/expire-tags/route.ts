import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = request.headers.get("authorization");

  if (
    !process.env.SANITY_REVALIDATE_SECRET ||
    secret !== `Bearer ${process.env.SANITY_REVALIDATE_SECRET}`
  ) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = (await request.json()) as {
    syncTags?: string[];
  };

  if (!Array.isArray(body.syncTags)) {
    return NextResponse.json(
      { message: "Missing syncTags" },
      { status: 400 },
    );
  }

  for (const tag of body.syncTags) {
    revalidateTag(`sanity:${tag}`, "max");
  }

  return NextResponse.json({
    revalidated: body.syncTags.length,
  });
}