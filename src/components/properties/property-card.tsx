"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, MapPin, Star, Trash2 } from "lucide-react"
import type { Property } from "@/lib/api/types"
import { formatDate, formatPrice, getStatusBadgeStyles } from "../../lib/utils"
import { useRouter } from "next/navigation"
type Props = {
  item: Property
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
}

export function PropertyCard({ item, isFavorite, onToggleFavorite, onDelete }: Props) {
  const image = item.images?.[0] || "/modern-house-exterior.png";
  let router = useRouter();

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
      <div
        style={{ backgroundImage: `url(${image})` }}
        className="relative aspect-[4/3] bg-cover bg-center"
        role="img"
        aria-label={`Image for ${item?.owner?.name || "property"}`}
      >
        {/* Favorite */}
        <button
          onClick={() => onToggleFavorite(item._id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"}`} />
        </button>

        {/* Status */}
        <div className="absolute left-3 top-3">
          <Badge className={getStatusBadgeStyles(item.status)} variant="secondary">
            <span className="capitalize">{item.status}</span>
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-semibold leading-tight text-foreground">{item?.owner?.name || "Unknown Owner"}</h3>
            <p className="text-sm text-muted-foreground">{item?.propertyType || "—"}</p>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-medium">4.8</span>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          <span className="line-clamp-1">{item?.location?.address || "Address unavailable"}</span>
        </div>

        <div className="mb-3 flex items-baseline gap-1">
          <span className="text-lg font-bold text-foreground">{formatPrice(item.price)}</span>
          <span className="text-xs text-muted-foreground">total</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          <span>{formatDate(item.createdAt)}</span>
        </div>

        {/* {item?.notes && <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{item.notes}</p>} */}

        <div className="mt-4 flex gap-2">
          <Button onClick={() => router.push(`/show-properties/${item._id}`)} variant="outline" size="sm" className="flex-1 bg-transparent" >
            View Details
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(item._id)}
            aria-label="Delete property"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
