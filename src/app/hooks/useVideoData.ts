import { useQuery } from "@tanstack/react-query"

const fetchVideos = async (filters, page) => {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(filters.keyword && { keyword: filters.keyword }),
    ...(filters.startDate && { start_date: filters.startDate }),
    ...(filters.endDate && { end_date: filters.endDate }),
    ...(filters.minLikes && { min_likes: filters.minLikes.toString() }),
    ...(filters.ordering && { ordering: filters.ordering }),
  })

  const response = await fetch(`http://127.0.0.1:8000/api/filtered-videos/?${params}`)
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  return response.json()
}

export function useVideoData(filters, page) {
  return useQuery(["videos", filters, page], () => fetchVideos(filters, page), {
    keepPreviousData: true,
  })
}

