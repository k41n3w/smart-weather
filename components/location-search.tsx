"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin } from "lucide-react"

interface LocationSearchProps {
  onLocationChange: (location: string) => void
  currentLocation: string
}

export default function LocationSearch({ onLocationChange, currentLocation }: LocationSearchProps) {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Mock suggestions - in a real app, this would come from an API
  const mockSuggestions = [
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Paris, France",
    "Sydney, Australia",
    "Berlin, Germany",
    "Toronto, Canada",
    "Singapore",
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.length > 1) {
      // Filter suggestions based on input
      const filtered = mockSuggestions.filter((city) => city.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onLocationChange(inputValue)
      setShowSuggestions(false)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setInputValue(suggestion)
    onLocationChange(suggestion)
    setShowSuggestions(false)
  }

  const handleUseCurrentLocation = () => {
    // In a real app, this would use the Geolocation API
    // For this demo, we'll just set a fixed location
    onLocationChange("Current Location")
    setInputValue("Current Location")
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search location..."
            value={inputValue}
            onChange={handleInputChange}
            className="pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={handleUseCurrentLocation}
          >
            <MapPin className="h-4 w-4" />
            <span className="sr-only">Use current location</span>
          </Button>
        </div>
        <Button type="submit" className="ml-2">
          <Search className="h-4 w-4 mr-2" />
          <span>Search</span>
        </Button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
          <ul>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-muted cursor-pointer"
                onClick={() => selectSuggestion(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
