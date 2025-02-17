import VideoList from "@/app/video-list"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Video Explorer</h1>
      <VideoList />
    </main>
  )
}

