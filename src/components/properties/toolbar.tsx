"use client"

import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* Search Input */}
      <div className="relative flex-1 md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by client, location, or property type..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
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
