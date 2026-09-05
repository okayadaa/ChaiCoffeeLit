import {defineField, defineType} from "sanity";

export const archiveItemType = defineType({
  name: "archiveItem",
  title: "Archive Item",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "image",
      title: "Image",
      description: "Main image displayed on the archive postcard.",
      type: "image",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      title: "Description",
      description: "Short description shown beneath the image.",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule
          .required()
          .min(10)
          .max(300),
    }),

    defineField({
      name: "eventDate",
      title: "Event Date",
      description: "Date associated with the event or archived item.",
      type: "date",
      validation: (rule) => rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "title",
      eventDate: "eventDate",
      media: "image",
    },

    prepare({title, eventDate, media}) {
      const date = eventDate
        ? new Date(eventDate).toLocaleDateString()
        : "No date";

      return {
        title,
        subtitle: date,
        media,
      };
    },
  },
});