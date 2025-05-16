import { decode } from "entities"

export async function getPosts() {
    const response = await fetch("https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts")
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()

    // Decode title and excerpt for each post
    const decodedPosts = data.map(post => ({
        ...post,
        title: {
            ...post.title,
            rendered: decode(post.title.rendered),
        },
        excerpt: {
            ...post.excerpt,
            rendered: decode(post.excerpt.rendered),
        },
    }))

    return decodedPosts
}