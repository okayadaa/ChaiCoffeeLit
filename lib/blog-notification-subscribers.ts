import "server-only";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type ActiveSubscriber = {
  id: string;
  email: string;
};

export async function getActiveSubscribers(): Promise<
  ActiveSubscriber[]
> {
  const supabase = getSupabaseAdmin();

  const subscribers: ActiveSubscriber[] = [];
  const pageSize = 500;
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("subscribers")
      .select("id, email")
      .eq("status", "active")
      .order("id", { ascending: true })
      .range(offset, offset + pageSize - 1);

    if (error) {
      throw new Error(
        `Failed to retrieve active subscribers: ${error.message}`
      );
    }

    const batch = data ?? [];

    subscribers.push(...batch);

    if (batch.length < pageSize) {
      break;
    }

    offset += pageSize;
  }

  return subscribers;
}
