import { mockPosts } from "./mock-posts";
import type { Post } from "./types";

function byNewestFirst(a: Post, b: Post) {
  return b.publishedAt.localeCompare(a.publishedAt);
}

export function getPublishedPosts(): Post[] {
  return mockPosts.filter((post) => post.published).sort(byNewestFirst);
}

export function getPostBySlug(slug: string): Post | undefined {
  return mockPosts.find((post) => post.slug === slug && post.published);
}
