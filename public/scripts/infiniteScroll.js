let currentPage = 1
let isLoading = false

window.addEventListener("DOMContentLoaded", async () => {
    const gallery = document.getElementById("post-gallery")
    const loading = document.getElementById("loading")
    const end = document.getElementById("end")
    const totalPages = Number(gallery.dataset.totalPages)

    const savedPage = Number(sessionStorage.getItem("scrollPage") || 1)
    const savedScroll = Number(sessionStorage.getItem("scrollPos") || 0)

    // load previously viewed pages before restoring scroll
    while (currentPage < savedPage && currentPage < totalPages) {
        await loadMorePosts(gallery, loading, end, totalPages)
    }

    // restore scroll after posts are loaded
    if (savedScroll > 0) {
        window.scrollTo({ top: savedScroll, behavior: "auto" })
        sessionStorage.removeItem("scrollPos")
        sessionStorage.removeItem("scrollPage")
    }

    // begin listening for scroll to load more
    window.addEventListener("scroll", () => {
        if (
            window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 300
        ) {
            loadMorePosts(gallery, loading, end, totalPages)
        }
    })

    // save scroll position and page on navigation
    window.addEventListener("beforeunload", () => {
        sessionStorage.setItem("scrollPos", window.scrollY)
        sessionStorage.setItem("scrollPage", currentPage)
    })
})

async function loadMorePosts(gallery, loading, end, totalPages) {
    if (isLoading || currentPage >= totalPages) return

    isLoading = true
    loading.style.display = "block"

    try {
        const nextPage = currentPage + 1
        const res = await fetch(
            `https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts?per_page=12&page=${nextPage}`
        )

        if (!res.ok) {
            console.error("Failed to load posts:", res.statusText)
            loading.style.display = "none"
            isLoading = false
            return
        }

        const newPosts = await res.json()
        currentPage++

        newPosts.forEach((post) => {
            const article = document.createElement("article")
            article.className = "post-thumb"
            article.innerHTML = `
                <a href="/blog/${post.slug}">
                    <img 
                        class="thumb-img" 
                        loading="lazy"
                        width="300" 
                        height="300"
                        src="${post.jetpack_featured_media_url || "/no-featured-img.webp"}"
                        alt="${post.title.rendered}"
                    />
                    <div class="thumb-details">
                        <p class="thumb-date">${post.date.slice(0, 10)}</p>
                        <h2 class="thumb-title">${post.title.rendered}</h2>
                    </div>
                </a>
            `
            gallery.appendChild(article)
        })

        loading.style.display = "none"

        if (currentPage >= totalPages) {
            end.style.display = "block"
        }
    } catch (err) {
        console.error("Error loading posts:", err)
    }

    isLoading = false
}