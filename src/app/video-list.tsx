// "use client"

// import React, { useEffect, useState, useCallback } from "react"
// import axios from "axios"
// import { useTable, usePagination, type Column } from "react-table"
// import { format } from "date-fns"
// import { Slider } from "@/components/ui/slider"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { CalendarIcon, Search } from "lucide-react"
// import { cn } from "@/lib/utils"
// import debounce from "lodash.debounce"

// interface Video {
//   id: string
//   title: string
//   likes: number
//   pub_date: string
//   desc: string
//   thumb: string
// }

// const VideoList = () => {
//   const [videos, setVideos] = useState<Video[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     keyword: "",
//     minLikes: 0,
//     startDate: null as Date | null,
//     endDate: null as Date | null,
//   })
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const fetchData = async (page = 1) => {
//     setLoading(true)
//     const { keyword, minLikes, startDate, endDate } = filters
//     let url = `http://127.0.0.1:8000/api/filtered-videos/?page=${page}`

//     if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`
//     if (minLikes) url += `&min_likes=${minLikes}`
//     if (startDate) url += `&start_date=${format(startDate, "yyyy-MM-dd")}`
//     if (endDate) url += `&end_date=${format(endDate, "yyyy-MM-dd")}`

//     try {
//       const response = await axios.get(url)
//       setVideos(response.data.results)
//       setTotalPages(Math.ceil(response.data.total_count / 10))
//     } catch (error) {
//       console.error("Error fetching data:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData(page)
//   }, [page, filters])

//   const columns: Column<Video>[] = React.useMemo(
//     () => [
//       {
//         Header: "Title",
//         accessor: "title",
//         Cell: ({ cell: { value }, row: { original } }) => (
//           <a
//             href={`https://www.youtube.com/watch?v=${original.id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 hover:underline"
//           >
//             {value}
//           </a>
//         ),
//       },
//       {
//         Header: "Likes",
//         accessor: "likes",
//         Cell: ({ cell: { value } }) => value.toLocaleString(),
//       },
//       {
//         Header: "Published Date",
//         accessor: "pub_date",
//         Cell: ({ cell: { value } }) => format(new Date(value), "PP"),
//       },
//       {
//         Header: "Description",
//         accessor: "desc",
//         Cell: ({ cell: { value } }) => (
//           <div className="max-w-xs">
//             {value.length > 100 ? `${value.substring(0, 100)}...` : value}
//             {value.length > 100 && (
//               <Button variant="link" className="p-0 h-auto">
//                 Read More
//               </Button>
//             )}
//           </div>
//         ),
//       },
//       {
//         Header: "Thumbnail",
//         accessor: "thumb",
//         Cell: ({ cell: { value } }) => (
//           <img src={value || "/placeholder.svg"} alt="Thumbnail" className="w-24 h-auto rounded" />
//         ),
//       },
//     ],
//     [],
//   )

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
//     {
//       columns,
//       data: videos,
//     },
//     usePagination,
//   )

//   const debouncedSearch = useCallback(
//     debounce((value: string) => {
//       setFilters((prev) => ({ ...prev, keyword: value }))
//     }, 500),
//     [],
//   )

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     debouncedSearch(e.target.value)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <Input
//             type="text"
//             placeholder="Search by title"
//             onChange={handleSearchChange}
//             className="w-full"
//             icon={<Search className="h-4 w-4" />}
//           />
//         </div>
//         <div className="flex-1 space-y-2">
//           <label className="text-sm font-medium">Likes Range</label>
//           <Slider
//             min={0}
//             max={10000000}
//             step={1000}
//             value={[filters.minLikes]}
//             onValueChange={(value) => setFilters((prev) => ({ ...prev, minLikes: value[0] }))}
//           />
//           <div className="text-sm text-muted-foreground">Min Likes: {filters.minLikes.toLocaleString()}</div>
//         </div>
//         <div className="flex-1 space-y-2">
//           <div className="flex space-x-2">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[240px] justify-start text-left font-normal",
//                     !filters.startDate && "text-muted-foreground",
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {filters.startDate ? format(filters.startDate, "PPP") : <span>Start Date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={filters.startDate}
//                   onSelect={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[240px] justify-start text-left font-normal",
//                     !filters.endDate && "text-muted-foreground",
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {filters.endDate ? format(filters.endDate, "PPP") : <span>End Date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={filters.endDate}
//                   onSelect={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
//       </div>

//       <Button onClick={() => fetchData(page)}>Apply Filters</Button>

//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <>
//           <Table {...getTableProps()}>
//             <TableHeader>
//               {headerGroups.map((headerGroup, index) => (
//                 <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
//                   {headerGroup.headers.map((column) => (
//                     <TableHead {...column.getHeaderProps()}>{column.render("Header")}</TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody {...getTableBodyProps()}>
//               {rows.map((row) => {
//                 prepareRow(row)
//                 return (
//                   <TableRow {...row.getRowProps()}>
//                     {row.cells.map((cell) => (
//                       <TableCell {...cell.getCellProps()}>{cell.render("Cell")}</TableCell>
//                     ))}
//                   </TableRow>
//                 )
//               })}
//             </TableBody>
//           </Table>
//           <div className="flex justify-between items-center mt-4">
//             <Button
//               onClick={() => {
//                 if (page > 1) setPage(page - 1)
//               }}
//               disabled={page === 1}
//             >
//               Previous
//             </Button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <Button
//               onClick={() => {
//                 if (page < totalPages) setPage(page + 1)
//               }}
//               disabled={page === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default VideoList


// "use client"

// import React, { useEffect, useState, useCallback } from "react"
// import axios from "axios"
// import { useTable, usePagination, type Column } from "react-table"
// import { format } from "date-fns"
// import { Slider } from "@/components/ui/slider"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { CalendarIcon } from "lucide-react"
// import { cn } from "@/lib/utils"
// import debounce from "lodash.debounce"

// interface Video {
//   id: string
//   title: string
//   likes: number
//   pub_date: string
//   desc: string
//   thumb: string
// }

// const VideoList = () => {
//   const [videos, setVideos] = useState<Video[]>([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     keyword: "",
//     minLikes: 0,
//     startDate: null as Date | null,
//     endDate: null as Date | null,
//   })
//   const [page, setPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)

//   const fetchData = useCallback(
//     async (currentPage = 1) => {
//       setLoading(true)
//       const { keyword, minLikes, startDate, endDate } = filters
//       let url = `http://127.0.0.1:8000/api/filtered-videos/?page=${currentPage}`

//       if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`
//       if (minLikes) url += `&min_likes=${minLikes}`
//       if (startDate) url += `&start_date=${format(startDate, "yyyy-MM-dd")}`
//       if (endDate) url += `&end_date=${format(endDate, "yyyy-MM-dd")}`

//       try {
//         const response = await axios.get(url)
//         setVideos(response.data.results)
//         setTotalPages(Math.ceil(response.data.total_count / 10))
//       } catch (error) {
//         console.error("Error fetching data:", error)
//       } finally {
//         setLoading(false)
//       }
//     },
//     [filters],
//   )

//   useEffect(() => {
//     fetchData(page)
//   }, [page, fetchData])

//   const columns: Column<Video>[] = React.useMemo(
//     () => [
//       {
//         Header: "Title",
//         accessor: "title",
//         Cell: ({ cell: { value }, row: { original } }) => (
//           <a
//             href={`https://www.youtube.com/watch?v=${original.id}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="text-blue-600 dark:text-blue-400 hover:underline"
//           >
//             {value}
//           </a>
//         ),
//       },
//       {
//         Header: "Likes",
//         accessor: "likes",
//         Cell: ({ cell: { value } }) => value.toLocaleString(),
//       },
//       {
//         Header: "Published Date",
//         accessor: "pub_date",
//         Cell: ({ cell: { value } }) => format(new Date(value), "PP"),
//       },
//       {
//         Header: "Description",
//         accessor: "desc",
//         Cell: ({ cell: { value } }) => (
//           <div className="max-w-xs">
//             {value.length > 100 ? `${value.substring(0, 100)}...` : value}
//             {value.length > 100 && (
//               <Button variant="link" className="p-0 h-auto">
//                 Read More
//               </Button>
//             )}
//           </div>
//         ),
//       },
//       {
//         Header: "Thumbnail",
//         accessor: "thumb",
//         Cell: ({ cell: { value } }) => (
//           <img src={value || "/placeholder.svg"} alt="Thumbnail" className="w-24 h-auto rounded" />
//         ),
//       },
//     ],
//     [],
//   )

//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
//     {
//       columns,
//       data: videos,
//     },
//     usePagination,
//   )

//   const debouncedSearch = useCallback(
//     debounce((value: string) => {
//       setFilters((prev) => ({ ...prev, keyword: value }))
//     }, 500),
//     [],
//   )

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     debouncedSearch(e.target.value)
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="flex-1">
//           <Input type="text" placeholder="Search by title" onChange={handleSearchChange} className="w-full" />
//         </div>
//         <div className="flex-1 space-y-2">
//           <label className="text-sm font-medium">Likes Range</label>
//           <Slider
//             min={0}
//             max={10000000}
//             step={1000}
//             value={[filters.minLikes]}
//             onValueChange={(value) => setFilters((prev) => ({ ...prev, minLikes: value[0] }))}
//           />
//           <div className="text-sm text-muted-foreground">Min Likes: {filters.minLikes.toLocaleString()}</div>
//         </div>
//         <div className="flex-1 space-y-2">
//           <div className="flex space-x-2">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[240px] justify-start text-left font-normal",
//                     !filters.startDate && "text-muted-foreground",
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {filters.startDate ? format(filters.startDate, "PPP") : <span>Start Date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={filters.startDate}
//                   onSelect={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button
//                   variant={"outline"}
//                   className={cn(
//                     "w-[240px] justify-start text-left font-normal",
//                     !filters.endDate && "text-muted-foreground",
//                   )}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {filters.endDate ? format(filters.endDate, "PPP") : <span>End Date</span>}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={filters.endDate}
//                   onSelect={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>
//         </div>
//       </div>

//       <Button onClick={() => fetchData(page)}>Apply Filters</Button>

//       {loading ? (
//         <div className="text-center">Loading...</div>
//       ) : (
//         <>
//           <div className="rounded-md border">
//             <Table {...getTableProps()}>
//               <TableHeader>
//                 {headerGroups.map((headerGroup, index) => (
//                   <TableRow key={index} {...headerGroup.getHeaderGroupProps()}>
//                     {headerGroup.headers.map((column, columnIndex) => (
//                       <TableHead key={columnIndex} {...column.getHeaderProps()}>
//                         {column.render("Header")}
//                       </TableHead>
//                     ))}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody {...getTableBodyProps()}>
//                 {rows.map((row, rowIndex) => {
//                   prepareRow(row)
//                   return (
//                     <TableRow key={rowIndex} {...row.getRowProps()}>
//                       {row.cells.map((cell, cellIndex) => (
//                         <TableCell key={cellIndex} {...cell.getCellProps()}>
//                           {cell.render("Cell")}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   )
//                 })}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex justify-between items-center mt-4">
//             <Button
//               onClick={() => {
//                 if (page > 1) setPage(page - 1)
//               }}
//               disabled={page === 1}
//             >
//               Previous
//             </Button>
//             <span>
//               Page {page} of {totalPages}
//             </span>
//             <Button
//               onClick={() => {
//                 if (page < totalPages) setPage(page + 1)
//               }}
//               disabled={page === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// export default VideoList

"use client"

import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { useTable, usePagination, type Column } from "react-table"
import { format } from "date-fns"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import debounce from "lodash.debounce"

interface Video {
  id: string
  title: string
  likes: number
  pub_date: string
  desc: string
  thumb: string
  url: string
}

const VideoList = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    keyword: "",
    minLikes: 0,
    startDate: null as Date | null,
    endDate: null as Date | null,
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchData = useCallback(
    async (currentPage = 1) => {
      setLoading(true)
      const { keyword, minLikes, startDate, endDate } = filters
      let url = `http://127.0.0.1:8000/api/filtered-videos/?page=${currentPage}`

      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`
      if (minLikes) url += `&min_likes=${minLikes}`
      if (startDate) url += `&start_date=${format(startDate, "yyyy-MM-dd")}`
      if (endDate) url += `&end_date=${format(endDate, "yyyy-MM-dd")}`

      try {
        const response = await axios.get(url)
        setVideos(response.data.results)
        setTotalPages(Math.ceil(response.data.total_count / 10))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    },
    [filters],
  )

  useEffect(() => {
    fetchData(page)
  }, [page, fetchData])

  const columns: Column<Video>[] = React.useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        Cell: ({ cell: { value }, row: { original } }) => (
          <a
            href={original.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            {value}
          </a>
        ),
      },
      {
        Header: "Likes",
        accessor: "likes",
        Cell: ({ cell: { value } }) => (
          <span className="font-semibold text-green-600 dark:text-green-400">{value.toLocaleString()}</span>
        ),
      },
      {
        Header: "Published Date",
        accessor: "pub_date",
        Cell: ({ cell: { value } }) => (
          <span className="text-gray-600 dark:text-gray-400">{format(new Date(value), "PP")}</span>
        ),
      },
      {
        Header: "Description",
        accessor: "desc",
        Cell: ({ cell: { value } }) => (
          <div className="max-w-xs">
            {value.substring(0, 100)}
            {value.length > 100 && "..."}
            {value.length > 100 && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400">
                    Read More
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Full Description</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>{value}</DialogDescription>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ),
      },
      {
        Header: "Thumbnail",
        accessor: "thumb",
        Cell: ({ cell: { value } }) => (
          <img src={value || "/placeholder.svg"} alt="Thumbnail" className="w-24 h-auto rounded-md shadow-md" />
        ),
      },
    ],
    [],
  )

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data: videos,
    },
    usePagination,
  )

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setFilters((prev) => ({ ...prev, keyword: value }))
    }, 500),
    [],
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search by title"
            onChange={handleSearchChange}
            className="w-full"
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Likes Range</label>
          <Slider
            min={0}
            max={10000000}
            step={1000}
            value={[filters.minLikes]}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, minLikes: value[0] }))}
          />
          <div className="text-sm text-muted-foreground">Min Likes: {filters.minLikes.toLocaleString()}</div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(filters.startDate, "PPP") : <span>Start Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(filters.endDate, "PPP") : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Button onClick={() => fetchData(page)} className="w-full">
        Apply Filters
      </Button>

      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="mt-2">Loading...</p>
        </div>
      ) : (
        <>
          <div className="rounded-lg border shadow-md overflow-hidden">
            <Table {...getTableProps()} className="w-full">
              <TableHeader>
                {headerGroups.map((headerGroup, index) => (
                  <TableRow key={index} {...headerGroup.getHeaderGroupProps()} className="bg-gray-100 dark:bg-gray-800">
                    {headerGroup.headers.map((column, columnIndex) => (
                      <TableHead
                        key={columnIndex}
                        {...column.getHeaderProps()}
                        className="font-bold text-gray-700 dark:text-gray-300"
                      >
                        {column.render("Header")}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody {...getTableBodyProps()}>
                {rows.map((row, rowIndex) => {
                  prepareRow(row)
                  return (
                    <TableRow
                      key={rowIndex}
                      {...row.getRowProps()}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <TableCell key={cellIndex} {...cell.getCellProps()} className="p-4">
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              onClick={() => {
                if (page > 1) setPage(page - 1)
              }}
              disabled={page === 1}
              variant="outline"
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {page} of {totalPages}
            </span>
            <Button
              onClick={() => {
                if (page < totalPages) setPage(page + 1)
              }}
              disabled={page === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default VideoList

