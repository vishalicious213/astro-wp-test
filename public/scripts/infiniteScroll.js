export function infiniteScroll() {
    console.log("infinite scroll")
    window.addEventListener('DOMContentLoaded', () => {
        const gallery = document.getElementById('post-gallery')
        const loading = document.getElementById('loading')
        const end = document.getElementById('end')
        const totalPages = Number(gallery.dataset.totalPages)

        let currentPage = 1
        let isLoading = false

        async function loadMorePosts() {
            if (isLoading || currentPage >= totalPages) return
            isLoading = true
            loading.style.display = 'block'

            try {
                const res = await fetch(
                    `https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts?per_page=12&page=${currentPage + 1}`
                )

                if (!res.ok) throw new Error("Failed to fetch more posts")

                const newPosts = await res.json()
                currentPage++

                newPosts.forEach((post) => {
                    const article = document.createElement("article")
                    article.className = "post-thumb"

                    const img = document.createElement("img")
                    img.className = "thumb-img"
                    img.loading = "lazy"
                    img.src = post.jetpack_featured_media_url || "/no-featured-img.webp"
                    img.alt = post.title.rendered
                    img.width = 300
                    img.height = 300

                    const link = document.createElement("a")
                    link.href = `/blog/${post.slug}`

                    const details = document.createElement("div")
                    details.className = "thumb-details"

                    const date = document.createElement("p")
                    date.className = "thumb-date"
                    date.textContent = post.date.slice(0, 10)

                    const title = document.createElement("h2")
                    title.className = "thumb-title"
                    title.innerHTML = post.title.rendered

                    details.append(date, title)
                    link.append(img, details)
                    article.appendChild(link)
                    gallery.appendChild(article)
                })

                if (currentPage >= totalPages) {
                end.style.display = "block"
                }
            } catch (err) {
                console.error("Error loading posts:", err)
            } finally {
                loading.style.display = "none"
                isLoading = false
            }
        }

        function handleScroll() {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                loadMorePosts()
            }
        }

        window.addEventListener('scroll', handleScroll)
    })
}

infiniteScroll()