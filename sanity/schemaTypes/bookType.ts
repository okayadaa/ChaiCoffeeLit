import { defineField, defineType } from "sanity";

export const bookType = defineType({
  name: "book",
  title: "Book",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "recommendedAt",
      title: "Recommended At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
  ],
});