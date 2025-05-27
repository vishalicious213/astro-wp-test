export async function getPostTags(postId) {
    const response = await fetch(`https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts/${postId}`)
    const post = await response.json()

    const categoryIds = post.categories.join(',')
    const tagIds = post.tags.join(',')

    const [categoriesRes, tagsRes] = await Promise.all([
        fetch(`https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/categories?include=${categoryIds}`),
        fetch(`https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/tags?include=${tagIds}`)
    ])

    const categories = await categoriesRes.json()
    const tags = await tagsRes.json()

    return {
        categoryNames: categories.map(cat => cat.name),
        tagNames: tags.map(tag => tag.name)
    }
}