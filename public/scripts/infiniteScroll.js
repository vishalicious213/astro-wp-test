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

            const res = await fetch(`https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/posts?per_page=12&page=${currentPage + 1}`)
            const newPosts = await res.json()
            currentPage++

            newPosts.forEach(post => {
                const article = document.createElement('article')
                article.className = 'post-thumb'

                article.innerHTML = `
                    <a href="/blog/${post.slug}">
                        <img class="thumb-img" loading="lazy" src="${post.jetpack_featured_media_url || "/no-featured-img.webp"}" alt="${post.title.rendered}" />
                        <div class="thumb-details">
                            <p class="thumb-date">${post.date.slice(0,10)}</p>
                            <h2 class="thumb-title">${post.title.rendered}</h2>
                        </div>
                    </a>
                `
                gallery.appendChild(article)
            })

            loading.style.display = 'none'

            if (currentPage >= totalPages) {
                end.style.display = 'block'
            }

            isLoading = false
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