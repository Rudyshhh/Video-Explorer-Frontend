import type React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { debounce } from "lodash"

interface FilterFormProps {
  filters: {
    keyword: string
    minLikes: string
    startDate: Date | null
    endDate: Date | null
    ordering: string
  }
  setFilters: React.Dispatch<React.SetStateAction<any>>
}

export function FilterForm({ filters, setFilters }: FilterFormProps) {
  const debouncedSetFilters = debounce(setFilters, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    debouncedSetFilters((prev: any) => ({ ...prev, [name]: value, page: 1 }))
  }

  const handleDateChange = (date: Date | null, name: string) => {
    setFilters((prev) => ({ ...prev, [name]: date, page: 1 }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <input
        type="text"
        name="keyword"
        placeholder="Search videos..."
        value={filters.keyword}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <input
        type="number"
        name="minLikes"
        placeholder="Minimum likes"
        value={filters.minLikes}
        onChange={handleInputChange}
        className="border p-2 rounded"
      />
      <DatePicker
        selected={filters.startDate}
        onChange={(date) => handleDateChange(date, "startDate")}
        placeholderText="Start Date"
        className="border p-2 rounded w-full"
      />
      <DatePicker
        selected={filters.endDate}
        onChange={(date) => handleDateChange(date, "endDate")}
        placeholderText="End Date"
        className="border p-2 rounded w-full"
      />
      <select name="ordering" value={filters.ordering} onChange={handleInputChange} className="border p-2 rounded">
        <option value="">Sort by</option>
        <option value="likes">Likes</option>
        <option value="views">Views</option>
        <option value="published_date">Published Date</option>
        <option value="relevance">Relevance</option>
      </select>
      <button
        onClick={() => setFilters((prev) => ({ ...prev, page: 1 }))}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  )
}

