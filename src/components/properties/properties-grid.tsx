"use client"

import type { Property } from "@/lib/api/types"
import { PropertyCard } from "./property-card"

type Props = {
  items: Property[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onDelete: (propertyId: string, brokerId:string) => void
}

export function PropertiesGrid({ items, favorites, onToggleFavorite, onDelete }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <PropertyCard
          key={item._id}
          item={item}
          isFavorite={favorites.has(item._id)}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
