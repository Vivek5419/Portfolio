import { VideoPlayer } from "@/components/video-player"

export default function Page() {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-3xl mx-auto">
        <VideoPlayer src="/placeholder.mp4" poster="/placeholder.svg?height=720&width=1280" />
      </div>
    </div>
  )
}
