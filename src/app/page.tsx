import VideoList from "@/app/video-list"
import { ThemeToggle } from "@/app/theme-toggle"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Video Explorer</h1>
        <ThemeToggle />
      </div>
      <VideoList />
    </main> 
  )
}

