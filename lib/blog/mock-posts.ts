import type { Post } from "./types";

export const mockPosts: Post[] = [
  {
    title: "The Ritual of Making Chai",
    slug: "the-ritual-of-making-chai",
    category: "Reflection",
    publishedAt: "2026-07-28",
    excerpt: "On patience, spice, and the small ceremonies that open a morning.",
    body: [
      "Every morning before the doors open, someone stands at the stove and begins again. Water first. Then the spices — crushed, not powdered — until the kitchen smells like cardamom and something warmer underneath.",
      "We do not rush the boil. The chai asks for a few quiet minutes, and the café gives them. Regulars know the sound of the pot before they know the time.",
      "Making chai is not a recipe so much as a ritual: attention, repetition, and the willingness to taste as you go. That is the note we try to keep in the cup.",
    ],
    published: true,
  },
  {
    title: "Books That Changed Our Café",
    slug: "books-that-changed-our-cafe",
    category: "Books",
    publishedAt: "2026-07-14",
    excerpt: "A short shelf of titles that reshaped how we host, brew, and listen.",
    body: [
      "A café collects books the way a river collects stones. Some arrive by chance. A few stay because they change the room.",
      "We keep a small shelf near the window for staff picks — not bestsellers by default, but books that make conversation easier, slower, more honest. Over time those titles have shaped how we think about hospitality.",
      "If you ask what changed our café, we will point you there first. The kettle matters. So does the page.",
    ],
    published: true,
  },
  {
    title: "Community Reading Night",
    slug: "community-reading-night",
    category: "Community",
    publishedAt: "2026-07-01",
    excerpt: "An evening of shared pages, chai, and neighbors becoming a room.",
    body: [
      "Once a month we push the tables aside, dim the front lights, and leave a circle of chairs. People bring a page they love — or a page they are still arguing with.",
      "Nobody has to be a polished reader. The point is to hear a voice in the room and answer it with attention. Between turns we pour chai and let the quiet sit.",
      "Community Reading Night is less a program than a habit: show up, listen, leave with someone else's sentence still in your pocket.",
    ],
    published: true,
  },
  {
    title: "Draft: Winter Menu Notes",
    slug: "draft-winter-menu-notes",
    category: "Reflection",
    publishedAt: "2026-08-01",
    excerpt: "Unpublished scratch notes for a colder season.",
    body: [
      "This draft should never appear in the published list. It exists only to prove the published filter works.",
    ],
    published: false,
  },
];
