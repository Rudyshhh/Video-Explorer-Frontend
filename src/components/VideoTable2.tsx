"use client"

import { useState } from "react"
import { useQuery } from "react-query"
import axios from "axios"
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table"
import { FilterForm } from "./FilterForm"
import { Pagination } from "./Pagination"
import type { Video } from "../types"

const columnHelper = createColumnHelper<Video>()

const columns = [
  columnHelper.accessor("title", {
    cell: (info) => (
      <a
        href={info.row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {info.getValue()}
      </a>
    ),
    header: "Title",
  }),
  columnHelper.accessor("likes", {
    cell: (info) => info.getValue().toLocaleString(),
    header: "Likes",
  }),
  columnHelper.accessor("pub_date", {
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    header: "Published Date",
  }),
  columnHelper.accessor("desc", {
    cell: (info) => {
      const description = info.getValue()
      return (
        <div>
          {description.length > 100 ? (
            <>
              {description.slice(0, 100)}...
              <button className="text-blue-600 hover:underline ml-2">Read More</button>
            </>
          ) : (
            description
          )}
        </div>
      )
    },
    header: "Description",
  }),
  columnHelper.accessor("thumb", {
    cell: (info) => <img src={info.getValue() || "/placeholder.svg"} alt="Thumbnail" className="w-24 h-auto" />,
    header: "Thumbnail",
  }),
]

export function VideoTable() {
  const [filters, setFilters] = useState({
    keyword: "",
    minLikes: "",
    startDate: null,
    endDate: null,
    ordering: "",
    page: 1,
  })

  const { data, isLoading, error } = useQuery(
    ["videos", filters],
    async () => {
      const params = new URLSearchParams()
      if (filters.keyword) params.append("keyword", filters.keyword)
      if (filters.minLikes) params.append("min_likes", filters.minLikes)
      if (filters.startDate) params.append("start_date", filters.startDate.toISOString().split("T")[0])
      if (filters.endDate) params.append("end_date", filters.endDate.toISOString().split("T")[0])
      if (filters.ordering) params.append("ordering", filters.ordering)
      params.append("page", filters.page.toString())

      const response = await axios.get(`http://127.0.0.1:8000/api/filtered-videos/?${params.toString()}`)
      return response.data
    },
    { keepPreviousData: true },
  )

  const table = useReactTable({
    data: data?.results || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {(error as Error).message}</div>

  return (
    <div className="container mx-auto p-4">
      <FilterForm filters={filters} setFilters={setFilters} />
      <table className="min-w-full bg-white border border-gray-300 mt-4">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 border-b">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={filters.page}
        totalPages={Math.ceil((data?.total_count || 0) / 10)}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </div>
  )
}

