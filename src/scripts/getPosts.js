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

export async function getPosts() {
    const response = await fetch("https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts?per_page=12&page=1")
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()

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

    return decodedPosts
}