import { syncTagInvalidateEventHandler } from "@sanity/functions";

export const handler = syncTagInvalidateEventHandler(
  async ({ event, done }) => {
    const siteUrl = process.env.NEXT_SITE_URL;
    const secret = process.env.SANITY_REVALIDATE_SECRET;

    if (!siteUrl || !secret) {
      throw new Error(
        "Missing NEXT_SITE_URL or SANITY_REVALIDATE_SECRET",
      );
    }

    try {
      console.log("Sync tags received:", event.data.syncTags);

      const response = await fetch(`${siteUrl}/api/expire-tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${secret}`,
        },
        body: JSON.stringify({
          syncTags: event.data.syncTags,
        }),
      });

      console.log(
        "Next.js cache invalidation response:",
        response.status,
      );

      if (!response.ok) {
        throw new Error(
          `Next.js cache invalidation failed with status ${response.status}`,
        );
      }

      const doneResponse = await done(event.data.syncTags);

      console.log(
        "Invalidation complete. Sanity responded with HTTP",
        doneResponse.status,
      );
    } catch (error) {
      console.error("Failed to invalidate sync tags", error);
      throw error;
    }
  },
);