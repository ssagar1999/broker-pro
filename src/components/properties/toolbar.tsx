"use client"

import { Search, SlidersHorizontal } from "lucide-react"
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
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative flex-1 md:max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by client, location, or property type..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select value={sortBy} onValueChange={(v) => onSortByChange(v as Props["sortBy"])}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="relative bg-transparent" onClick={onOpenFilters}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs" variant="default">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  )
}
