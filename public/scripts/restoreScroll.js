export function restoreScroll() {
    // Save scroll position before link navigation
    document.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('.post-thumb a')
        links.forEach(link => {
            link.addEventListener('click', () => {
                sessionStorage.setItem('scrollPos', window.scrollY)
            })
        })
    
        // Restore scroll position if available
        const savedScroll = sessionStorage.getItem('scrollPos')
        if (savedScroll !== null) {
            window.scrollTo({ top: parseInt(savedScroll), behavior: 'auto' })
            sessionStorage.removeItem('scrollPos') // Clean up
        }
    })
}

restoreScroll()