// src/scripts/getAllPosts.js
import { decode } from "entities"

export async function getAllPosts() {
  const baseUrl = "https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts"
  const perPage = 100
  let page = 1
  let allPosts = []
  let totalPages = 1

  while (page <= totalPages) {
    const res = await fetch(`${baseUrl}?per_page=${perPage}&page=${page}`)

    if (!res.ok) {
      throw new Error(`Failed to fetch posts on page ${page}`)
    }

    const posts = await res.json()
    const thisPage = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        title: {
          ...post.title,
          rendered: decode(post.title.rendered),
        },
        excerpt: {
          ...post.excerpt,
          rendered: decode(post.excerpt.rendered),
        },
        content: {
          ...post.content,
          rendered: decode(await fixText(post.content.rendered)),
        },
      }))
    )

    allPosts.push(...thisPage)

    // Get totalPages from header (only once)
    if (page === 1) {
      totalPages = parseInt(res.headers.get("X-WP-TotalPages"), 10)
    }

    page++
  }

  return allPosts
}

async function fixText(text) {
  const replacements = {
    "â€™": "'",
    "/â€œ": '"',
    "â€�": '"',
    "â€“": "-",
    "â€”": "-",
    "â€¦": "…",
  }

  return text.replace(/â€™|â€œ|â€�|â€“|â€”|â€¦/g, (match) => replacements[match])
}
