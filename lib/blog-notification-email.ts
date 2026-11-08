import "server-only";

import {
  createUnsubscribeToken,
} from "@/lib/unsubscribe-token";

type BlogNotificationEmailInput = {
  subscriberId: string;
  postTitle: string;
  postSlug: string;
};

export function createBlogNotificationEmail({
  subscriberId,
  postTitle,
  postSlug,
}: BlogNotificationEmailInput) {
  const siteUrl =
    process.env.SITE_URL ??
    "https://chaicoffeelit.org";

  const articleUrl = new URL(
    `/blog/${encodeURIComponent(postSlug)}`,
    siteUrl
  );

  const unsubscribeToken =
    createUnsubscribeToken(subscriberId);

  const unsubscribeUrl = new URL(
    "/unsubscribe",
    siteUrl
  );

  unsubscribeUrl.searchParams.set(
    "token",
    unsubscribeToken
  );

  const subject = `New on Chai Coffee Lit: ${postTitle}`;

  const text = [
    "Hello!",
    "",
    "A new article has been published on Chai Coffee Lit.",
    "",
    postTitle,
    "",
    `Read the article: ${articleUrl.toString()}`,
    "",
    "Thanks for subscribing!",
    "Chai Coffee Lit ☕",
    "",
    `Unsubscribe: ${unsubscribeUrl.toString()}`,
  ].join("\n");

  return {
    from: "Chai Coffee Lit <notifications@mail.chaicoffeelit.org>",
    subject,
    text,
    articleUrl: articleUrl.toString(),
    unsubscribeUrl: unsubscribeUrl.toString(),
  };
}
