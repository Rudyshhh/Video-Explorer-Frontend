"use client"

import { useState } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { useVideoData } from "../hooks/useVideoData"
import { Button } from "@/components/ui/button"

export default function VideoTable({ filters }) {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError } = useVideoData(filters, page)

  const columns = [
    {
      field: "title",
      headerName: "Title",
      width: 300,
      renderCell: (params) => (
        <a href={params.row.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {params.value}
        </a>
      ),
    },
    { field: "likes", headerName: "Likes", width: 100 },
    {
      field: "pub_date",
      headerName: "Published Date",
      width: 200,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "desc",
      headerName: "Description",
      width: 300,
      renderCell: (params) => (
        <div>
          {params.value.slice(0, 100)}
          {params.value.length > 100 && (
            <Button variant="link" onClick={() => alert(params.value)}>
              Read More
            </Button>
          )}
        </div>
      ),
    },
    {
      field: "thumb",
      headerName: "Thumbnail",
      width: 150,
      renderCell: (params) => (
        <img src={params.value || "/placeholder.svg"} alt="Video thumbnail" className="w-20 h-auto" />
      ),
    },
  ]

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error fetching data</div>

  return (
    <div className="h-[600px] w-full">
      <DataGrid
        rows={data?.results || []}
        columns={columns}
        pageSize={10}
        rowCount={data?.total_count || 0}
        paginationMode="server"
        onPageChange={(newPage) => setPage(newPage + 1)}
        disableSelectionOnClick
      />
      <div className="flex justify-between mt-4">
        <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => setPage((prev) => prev + 1)} disabled={!data?.next_page}>
          Next
        </Button>
      </div>
    </div>
  )
}

