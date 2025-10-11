"use client"

import { useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { ImageSlider } from "@/components/properties/image-slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePropertiesStore } from "../../../lib/store/propertyStore"
import { formatPrice } from "../../../lib/utils" // add import
import { AppLayout } from "@/components/layout/app-layout"

export default function PropertyDetailsPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ?? ""
  const router = useRouter()

  const detailsById = usePropertiesStore((s) => s.detailsById || {})
  const isLoadingDetail = usePropertiesStore((s) => !!s.isLoadingDetail)
  const fetchPropertyById = usePropertiesStore((s) => s.fetchPropertyById!)

  const property = detailsById[id]

  useEffect(() => {
    if (!id) return
    if (!property) fetchPropertyById(id)
  }, [id, property, fetchPropertyById])

  const sliderImages = useMemo(() => {
    const imgs = (property?.images as string[] | undefined) || []
    if (imgs.length > 0) {
      return imgs.map((src, i) => ({
        src,
        alt: `${(property as any)?.title ?? property?.location?.address ?? "Property"} image ${i + 1}`,
      }))
    }
    // Fallback images (safe placeholders)
    return [
      { src: "/primary-property-image.jpg", alt: "Primary property image" },
      { src: "/secondary-property-image.jpg", alt: "Secondary property image" },
    ]
  }, [property])



  if (isLoadingDetail && !property) {
    // Lightweight inline skeleton; route-level loading.tsx also covers initial transition
    return (
      <main className="container mx-auto px-4 py-6">
        <div className="grid gap-6">
          <div className="h-64 w-full rounded-xl bg-muted animate-pulse md:h-[420px]" />
          <div className="space-y-3">
            <div className="h-6 w-2/3 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-28 rounded-lg bg-muted animate-pulse" />
            <div className="h-28 rounded-lg bg-muted animate-pulse" />
            <div className="h-28 rounded-lg bg-muted animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-48 rounded-lg bg-muted animate-pulse lg:col-span-2" />
            <div className="h-48 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </main>
    )
  }

  // if (!property) {
  //   return (
  //     <main className="container mx-auto px-4 py-12">
  //       <Card className="border-dashed">
  //         <CardContent className="py-12 text-center text-muted-foreground">No property found.</CardContent>
  //       </Card>
  //     </main>
  //   )
  // }

  const status = (property as any)?.status ?? "available"
  const price = (property as any)?.price ?? 0
  const title = (property as any)?.title ?? property?.location?.address ?? "Property"
  const address = property?.location?.address
  const city = property?.location?.locality || property?.location?.city
  const district = property?.location?.district
  const pincode = property?.location || 8989

  return (
    <AppLayout>
          <main className="container mx-auto px-4 py-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-xl border">
        <div className="relative w-full h-[280px] md:h-[420px]">
       <ImageSlider
          images={sliderImages}
          className="rounded-none border-0"
          heightClassName="h-[260px] md:h-[420px]"
          showIndicators
          showArrows
        />
        </div>
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">{status}</Badge>
          <Badge variant="secondary" className="backdrop-blur">
            {formatPrice(price)} {/* replaced ${(price || 0).toLocaleString()} */}
          </Badge>
        </div>
      </section>

      {/* Header */}
      <header className="mt-6 flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-balance">{title}</h1>
        <p className="text-muted-foreground">
          {address ? `${address}` : ""}
          {city ? `, ${city}` : ""}
          {district ? `, ${district}` : ""}
          {pincode ? ` ${pincode}` : ""}
        </p>
      </header>

      {/* Key Facts */}
      <section className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Price</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium">
            {formatPrice(price)} {/* replaced ${(price || 0).toLocaleString()} */}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Bedrooms</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium">{(property as any)?.bedrooms ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Bathrooms</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium">{(property as any)?.bathrooms ?? "—"}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Area (sqft)</CardTitle>
          </CardHeader>
          <CardContent className="text-lg font-medium">
            {(property as any)?.areaSqFt ?? (property as any)?.area ?? "—"}
          </CardContent>
        </Card>
      </section>

      {/* Description + Features */}
      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent className="text-pretty leading-relaxed text-sm md:text-base text-foreground/90">
            {(property as any)?.description ??
              "Details about this property will appear here. Contact the agent for more information."}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 text-sm">
              {Array.isArray((property as any)?.features) && (property as any)?.features.length > 0 ? (
                (property as any).features.map((f: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{f}</span>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground">No features listed.</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Agent / Contact */}
      <section className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Agent</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="font-medium">{property?.owner?.name ?? "Agent"}</p>
              <p className="text-sm text-muted-foreground">
                {property?.owner?.email ?? "agent@example.com"}{" "}
                {property?.owner?.phoneNumber ? `• ${property.owner.phoneNumber}` : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="default" onClick={() => router.push(`/edit-property/${property?._id}`)}>Edit</Button>
              {/* <Button variant="secondary">Schedule Tour</Button> */}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sticky Actions for mobile */}
      <div className="fixed bottom-4 left-0 right-0 px-4 md:hidden">
        <div className="mx-auto max-w-screen-sm rounded-xl border bg-card text-card-foreground shadow-lg">
          <div className="flex items-center justify-between p-3">
            <div className="text-sm">
              <div className="font-medium">
                {formatPrice(price)} {/* replaced ${(price || 0).toLocaleString()} */}
              </div>
              <div className="text-muted-foreground capitalize">{status}</div>
            </div>
            <Button size="sm">Contact</Button>
          </div>
        </div>
      </div>
    </main>
    </AppLayout>

  )
}
