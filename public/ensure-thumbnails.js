// This script ensures video thumbnails are visible
;(() => {
  // Run immediately
  function ensureThumbnails() {
    const videos = document.querySelectorAll("video")
    videos.forEach((video) => {
      // Make sure poster is set
      if (!video.poster || video.poster === "") {
        video.poster = "/placeholder.svg?height=720&width=405&text=Video"
      }

      // Force poster to be displayed
      video.preload = "none"
      video.load()
    })
  }

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureThumbnails)
  } else {
    ensureThumbnails()
  }

  // Run again after a short delay to catch dynamically added videos
  setTimeout(ensureThumbnails, 500)
})()

