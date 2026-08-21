import {defineField, defineType} from "sanity";

export const postType = defineType({
  name: "post",
  title: "Blog Post",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      description: "Used in the blog post URL. Click on generate to create a slug.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      description: "Label used to categorize the post.",
      type: "string",
      validation: (rule) => 
        rule
          .required()
          .min(2)
          .max(40),
    }),

    defineField({
      name: "publishedAt",
      title: "Published Date",
      description:
        "The post will appear on the website once this date and time is reached.",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      description:
        "A short summary used in blog previews and page metadata.",
      type: "text",
      rows: 3,
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{type: "block"}],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      publishedAt: "publishedAt",
    },
  
    prepare({ title, category, publishedAt }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : "No publish date";
  
      return {
        title,
        subtitle: `${category ?? "No category"} · ${date}`,
      };
    },
  },
});

