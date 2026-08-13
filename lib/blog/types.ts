export type BlogListPost = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
};

export type Post = BlogListPost & {
  excerpt?: string;
  body: string[];
  published: boolean;
};
