export async function getPosts() {
    let postsToRender = ""
    const response = await fetch("https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts")
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()

    data.map(post => {
        postsToRender += `
            <section class="post-thumb">
                <img 
                    class="thumb-img" 
                    src=${post.jetpack_featured_media_url} 
                    alt=${post.title.rendered}
                />
                <h2 class="thumb-title">${post.title.rendered}</h2>
            </section>
        `
    })

    return postsToRender
}