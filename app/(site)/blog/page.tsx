import { BlogPostList } from "@/components/brochure/ui/BlogPostList";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import type { BlogListPost } from "@/lib/blog/types";
import SubscribeForm from "@/components/SubscribeForm";
import SubscriptionStatus from "@/components/SubscriptionStatus";

type BlogPageProps = {
  searchParams: Promise<{
    subscription?: string;
  }>;
};

export default async function BlogPage({
  searchParams,
}: BlogPageProps) {
  const { subscription } = await searchParams;

  const { data } = await sanityFetch({
    query: POSTS_QUERY,
  });

  const posts = data as BlogListPost[];

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SubscriptionStatus status={subscription} />

      {/* Existing blog posts */}
      <BlogPostList posts={posts} />

      {/* Email subscription form */}
      <section className="mt-12">
        <SubscribeForm />
      </section>

    </div>
  );
}
