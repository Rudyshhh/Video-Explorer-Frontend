"use client"

import { useState } from "react"

export const DatePicker = ({ onChange, placeholder }) => {
  const [date, setDate] = useState("")

  return (
    <input
      type="date"
      placeholder={placeholder}
      value={date}
      onChange={(e) => {
        setDate(e.target.value)
        onChange(e.target.value)
      }}
    />
  )
}

