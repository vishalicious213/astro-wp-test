import { decode } from "entities"

async function fixText(text) {
    let replacements = {
        "â€™": "'",
        "/â€œ": '"',
        "â€�": '"',
        "â€“": "-",
        "â€”": "-",
        "â€¦": "…"
    }

    let newText = await text.replace(/â€™|â€œ|â€�|â€“|â€”|â€¦/g, (match) => {
        return replacements[match];
    })

    return newText
}

export async function getPosts(page=1, perPage=24) {
    const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts?per_page=${perPage}&page=${page}`)
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }
    const data = await response.json()
    const total = parseInt(response.headers.get('X-WP-Total'), 10)
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages'), 10)


    // Decode title and excerpt for each post
    const decodedPosts = await data.map(post => ({
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
            rendered: fixText(post.content.rendered),
        }
    }))

    // console.log(decodedPosts[3].content.rendered)

    return {
        posts: decodedPosts,
        total,
        totalPages,
        currentPage: page
    }
}