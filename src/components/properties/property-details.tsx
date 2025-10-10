"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Property } from "../../lib/api/types"

type Props = {
  property: Property
}

export function PropertyDetails({ property }: Props) {
  const hero = property?.images?.[0] || "/property-hero.jpg"

  const price = property?.price
//   const beds = property?.beds ?? property?.bedrooms
//   const baths = property?.baths ?? property?.bathrooms
     const area = property?.area || 0
//   const type = property?.type ?? property?.propertyType
     const status = property?.status ?? (property?.isActive ? "Active" : "Inactive")
     const address = property?.location?.address || "Address unavailable"

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded-lg overflow-hidden border bg-card">
        <div className="relative aspect-[16/9] w-full bg-muted">
          {/* Use a static src fallback to avoid CORS */}
          <Image
            src={hero || "/placeholder.svg"}
            alt={`${property?.owner?.name ?? "Property"} hero image`}
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-pretty">
                {property?.owner?.name || "Property"}
              </h1>
              <p className="text-muted-foreground">{address}</p>
            </div>
            <div className="flex items-center gap-2">
              {status && (
                <Badge variant="secondary" className={cn("uppercase tracking-wide")}>
                  {status}
                </Badge>
              )}
              { <Badge>{'this is type'}</Badge>}
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Price</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold">
                {price ? `₹${Number(price).toLocaleString()}` : "—"}
              </CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Bedrooms</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold">{'beds'}</CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Bathrooms</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold">{'baths'}</CardContent>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Area</CardTitle>
              </CardHeader>
              <CardContent className="text-xl font-semibold">{area ? `${area} sqft` : "—"}</CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <Card className="md:col-span-2 bg-card">
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="text-pretty leading-relaxed text-foreground/90">
                {property?.description ||
                  "No description available for this property. Contact the agent for more details."}
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Agent</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-muted" aria-hidden />
                <div>
                  <div className="font-medium">{ property?.owner?.name || "Agent"}</div>
                  <div className="text-sm text-muted-foreground">
                    { property?.owner?.phoneNumber || "Phone number unavailable"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  )
}
