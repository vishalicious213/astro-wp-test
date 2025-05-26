export function infiniteScroll() {
    document.addEventListener("DOMContentLoaded", () => {
        const gallery = document.getElementById("post-gallery")
        const loading = document.getElementById("loading")
        const end = document.getElementById("end")
        const sentinel = document.getElementById("scroll-trigger")
        const totalPages = Number(gallery.dataset.totalPages)

        let currentPage = 1
        let isLoading = false

        // restore scroll position if saved
        const savedScroll = sessionStorage.getItem("scrollPos")
        const savedPage = Number(sessionStorage.getItem("scrollPage"))

        if (savedScroll !== null && savedPage > 1) {
        // load enough pages first
        (async function preloadPages() {
                for (let i = 2; i <= savedPage; i++) {
                await loadMorePosts(true); // preload mode = no scroll
            }
            window.scrollTo({ top: parseInt(savedScroll), behavior: "auto" })
            sessionStorage.removeItem("scrollPos")
            sessionStorage.removeItem("scrollPage")
        })()
        }

        // load posts function
        async function loadMorePosts(preload = false) {
            if (isLoading || currentPage >= totalPages) return

            isLoading = true
            if (!preload) loading.style.display = "block"

            try {
                const res = await fetch(
                    `https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts?per_page=12&page=${currentPage + 1}`
                )

                if (!res.ok) throw new Error("Failed to fetch posts")

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

                if (currentPage >= totalPages) {
                    observer.disconnect()
                    end.style.display = "block"
                }
            } catch (err) {
                console.error("Error loading posts:", err)
            } finally {
                isLoading = false
                loading.style.display = "none"
            }
        }

        // IntersectionObserver for infinite scroll
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        loadMorePosts()
                    }
                })
            },
            {
                rootMargin: "300px",
            }
        )

        if (sentinel) {
            observer.observe(sentinel)
        } else {
            console.warn("No #scroll-trigger found")
        }

        // save scroll + page on link click
        document.addEventListener("click", (e) => {
        const target = e.target.closest(".post-thumb a")
            if (target) {
                sessionStorage.setItem("scrollPos", window.scrollY.toString())
                sessionStorage.setItem("scrollPage", currentPage.toString())
            }
        })
    })
}

infiniteScroll()