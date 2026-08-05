export type Post = {
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  excerpt?: string;
  body: string[];
  published: boolean;
};
