"use client"

import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useRef, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"

// How long to wait after the last keystroke before searching
const SEARCH_DEBOUNCE_MS = 500

type Props = {
  searchQuery: string
  onSearchQueryChange: (v: string) => void
  sortBy: "recent" | "oldest" | "price-low" | "price-high"
  onSortByChange: (v: "recent" | "oldest" | "price-low" | "price-high") => void
  activeFilterCount: number
  onOpenFilters: () => void
}

export function Toolbar({
  searchQuery,
  onSearchQueryChange,
  sortBy,
  onSortByChange,
  activeFilterCount,
  onOpenFilters,
}: Props) {
  // What the user is typing right now (updates on every keystroke)
  const [inputValue, setInputValue] = useState(searchQuery)
  // Same value, but only updates once typing has paused
  const debouncedInput = useDebounce(inputValue, SEARCH_DEBOUNCE_MS)
  // Last query we know the store has, so we never send it twice
  const lastSentQuery = useRef(searchQuery)

  // If the query is changed from outside (e.g. "Clear all filters", or restored
  // from localStorage), show it in the input without re-sending it.
  useEffect(() => {
    if (searchQuery !== lastSentQuery.current) {
      lastSentQuery.current = searchQuery
      setInputValue(searchQuery)
    }
  }, [searchQuery])

  // Keep the latest callback in a ref so the effect below runs only when the
  // debounced value changes — never because the parent re-rendered.
  const onSearchQueryChangeRef = useRef(onSearchQueryChange)
  useEffect(() => {
    onSearchQueryChangeRef.current = onSearchQueryChange
  }, [onSearchQueryChange])

  // Only the settled value reaches the store, which is what triggers the API call
  useEffect(() => {
    if (debouncedInput !== lastSentQuery.current) {
      lastSentQuery.current = debouncedInput
      onSearchQueryChangeRef.current(debouncedInput)
    }
  }, [debouncedInput])

  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by client, location, or property type..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pl-10 h-11 bg-background border-border focus:border-primary transition-colors"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v) => onSortByChange(v as Props["sortBy"])}>
            <SelectTrigger className="w-[180px] h-11 bg-background border-border focus:border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters Button */}
        <Button 
          variant="outline" 
          className={`relative h-11 px-4 bg-background border-border hover:bg-muted/50 transition-all ${
            activeFilterCount > 0 ? 'border-primary bg-primary/5' : ''
          }`} 
          onClick={onOpenFilters}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge 
              className="ml-2 h-5 w-5 rounded-full p-0 text-xs font-semibold bg-primary text-primary-foreground border-0" 
              variant="default"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )
}
