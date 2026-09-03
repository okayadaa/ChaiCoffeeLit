import {defineQuery} from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt
  }
`);

export const POST_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    publishedAt,
    excerpt,
    body
  }
  `);

export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
    *[
      _type == "post" &&
      defined(slug.current) &&
      defined(publishedAt) &&
      publishedAt <= now() &&
      category == $category
    ] | order(publishedAt desc) {
      _id,
      title,
      "slug": slug.current,
      category,
      publishedAt,
      excerpt
    }
  `);

export const PARTICIPANTS_QUERY = defineQuery(`
    *[
      _type == "participant" &&
      defined(name) &&
      defined(role) &&
      defined(bio) &&
      defined(image)
    ] | order(order asc) {
      _id,
      name,
      role,
      bio,
      image,
      order
    }
  `);

export const BOOKS_QUERY = defineQuery(`
    *[_type == "book"]
    | order(recommendedAt desc) {
      _id,
      title,
      author,
      coverImage,
      recommendedAt
    }
  `)