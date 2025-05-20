export async function getPages() {
    const response = await fetch("https://public-api.wordpress.com/wp/v2/sites/neophyte.home.blog/pages")
    
    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
}