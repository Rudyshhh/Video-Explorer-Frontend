"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import debounce from "lodash/debounce"

export default function FilterInterface({ onFilterChange }) {
  const [keyword, setKeyword] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [minLikes, setMinLikes] = useState(0)
  const [ordering, setOrdering] = useState("relevance")

  const debouncedFilterChange = useCallback(
    debounce((filters) => {
      onFilterChange(filters)
    }, 300),
    [],
  )

  const handleChange = (name, value) => {
    const newFilters = { keyword, startDate, endDate, minLikes, ordering, [name]: value }
    debouncedFilterChange(newFilters)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <Input
        placeholder="Search videos..."
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value)
          handleChange("keyword", e.target.value)
        }}
      />
      <DatePicker
        placeholder="Start Date"
        onChange={(date) => {
          setStartDate(date)
          handleChange("startDate", date)
        }}
      />
      <DatePicker
        placeholder="End Date"
        onChange={(date) => {
          setEndDate(date)
          handleChange("endDate", date)
        }}
      />
      <div>
        <label className="block text-sm font-medium mb-1">Min Likes: {minLikes}</label>
        <Slider
          min={0}
          max={1000000}
          step={1000}
          value={[minLikes]}
          onValueChange={(value) => {
            setMinLikes(value[0])
            handleChange("minLikes", value[0])
          }}
        />
      </div>
      <Select
        value={ordering}
        onValueChange={(value) => {
          setOrdering(value)
          handleChange("ordering", value)
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="likes">Likes</SelectItem>
          <SelectItem value="views">Views</SelectItem>
          <SelectItem value="published_date">Published Date</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={() => onFilterChange({ keyword, startDate, endDate, minLikes, ordering })}>Apply Filters</Button>
    </div>
  )
}

