export type BlogListPost = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  excerpt?: string;
  author?: string;
};

export type Post = BlogListPost & {
  body: string[];
  published: boolean;
};