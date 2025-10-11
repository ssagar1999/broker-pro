"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ImageSlider } from "@/components/properties/image-slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { usePropertiesStore } from "../../../lib/store/propertyStore"
import useUserStore from "../../../lib/store/userStore"
import { formatPrice } from "../../../lib/utils"
import { AppLayout } from "@/components/layout/app-layout"
import { 
  MapPin, 
  Calendar, 
  Home, 
  Car, 
  TreePine, 
  Wifi, 
  Shield, 
  Star,
  Heart,
  Share2,
  Phone,
  Mail,
  Edit,
  ArrowLeft,
  CheckCircle,
  Clock,
  Users,
  Eye,
  Building,
  Bed,
  Bath,
  Square,
  Layers
} from "lucide-react"
import { toastUtils } from "../../../lib/utils/toast"

export default function PropertyDetailsPage() {
  const params = useParams() as { id?: string }
  const id = params?.id ?? ""
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)

  const detailsById = usePropertiesStore((s) => s.detailsById || {})
  const isLoadingDetail = usePropertiesStore((s) => s.isLoadingDetail)
  const fetchProperty = usePropertiesStore((s) => s.fetchProperty)
  const userId = useUserStore((s) => s.userId)

  const property = detailsById[id]

  useEffect(() => {
    if (!id || !userId) return
    if (!property) fetchProperty(id, userId)
  }, [id, property, fetchProperty, userId])

  // Helper functions
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title || 'Property Details',
        text: `Check out this property: ${property?.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toastUtils.success('Link copied to clipboard!')
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    toastUtils.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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

  if (!isLoadingDetail && !property && id) {
    return (
      <AppLayout>
        <main className="container mx-auto px-4 py-12">
          <Card className="border-dashed">
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>Property not found.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/show-properties')}
              >
                Back to Properties
              </Button>
            </CardContent>
          </Card>
        </main>
      </AppLayout>
    )
  }

  const status = (property as any)?.status ?? "available"
  const price = (property as any)?.price ?? 0
  const title = (property as any)?.title ?? property?.location?.address ?? "Property"
  const address = property?.location?.address
  const city = property?.location?.locality || property?.location?.city
  const district = property?.location?.district
  const pincode = property?.pincode || ""

  return (
    <AppLayout>
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border shadow-lg">
          <div className="relative w-full h-[300px] md:h-[500px]">
            <ImageSlider
              images={sliderImages}
              className="rounded-none border-0"
              heightClassName="h-[300px] md:h-[500px]"
              showIndicators
              showArrows
            />
          </div>
          
          {/* Floating Badges */}
          <div className="absolute left-6 top-6 flex items-center gap-3">
            <Badge className="bg-primary text-primary-foreground px-3 py-1 text-sm font-medium">
              {status}
            </Badge>
            <Badge variant="secondary" className="backdrop-blur bg-white/90 px-3 py-1 text-sm font-medium">
              {formatPrice(price)}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="absolute right-6 top-6 flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={handleFavorite}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur hover:bg-white"
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={handleShare}
              className="h-10 w-10 rounded-full bg-white/90 backdrop-blur hover:bg-white"
            >
              <Share2 className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </section>

        {/* Property Header */}
        <header className="mt-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-primary" />
                <Badge variant="outline" className="capitalize">
                  {property?.propertyType}
                </Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {title}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span className="text-lg">
                  {address}
                  {city && `, ${city}`}
                  {district && `, ${district}`}
                  {pincode && ` - ${pincode}`}
                </span>
              </div>
              
              {/* Property Stats */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{property?.meta?.views || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Listed {formatDate(property?.createdAt || '')}</span>
                </div>
                {property?.meta?.verified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price Display */}
            <div className="lg:text-right">
              <div className="text-4xl font-bold text-primary mb-2">
                {formatPrice(price)}
              </div>
              <div className="text-sm text-muted-foreground capitalize">
                For {property?.category}
              </div>
            </div>
          </div>
        </header>

        {/* Key Features Grid */}
        <section className="mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Bed className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{property?.rooms || '—'}</div>
                  <div className="text-sm text-muted-foreground">Rooms</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <Bath className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{property?.rooms?.includes('BHK') ? '2' : '—'}</div>
                  <div className="text-sm text-muted-foreground">Bathrooms</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-green-100">
                  <Square className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{property?.area || '—'}</div>
                  <div className="text-sm text-muted-foreground">Sq Ft</div>
                </div>
              </div>
            </Card>

            <Card className="p-6 text-center hover:shadow-md transition-shadow">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-full bg-purple-100">
                  <Layers className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{property?.floors || '—'}</div>
                  <div className="text-sm text-muted-foreground">Floors</div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  About This Property
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/90 leading-relaxed">
                  {property?.description || 
                    "This beautiful property offers modern amenities and a prime location. Contact the agent for more detailed information about this exceptional opportunity."}
                </p>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Property Type</span>
                      <span className="font-medium capitalize">{property?.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Furnishing</span>
                      <span className="font-medium">{property?.furnishing || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category</span>
                      <span className="font-medium capitalize">{property?.category}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Area</span>
                      <span className="font-medium">{property?.area} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Floors</span>
                      <span className="font-medium">{property?.floors || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pincode</span>
                      <span className="font-medium">{property?.pincode || 'Not specified'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address</span>
                    <span className="font-medium text-right max-w-xs">{property?.location?.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">City</span>
                    <span className="font-medium">{property?.location?.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">District</span>
                    <span className="font-medium">{property?.location?.district}</span>
                  </div>
                  {property?.location?.locality && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Locality</span>
                      <span className="font-medium">{property?.location?.locality}</span>
                    </div>
                  )}
                  {property?.location?.landmark && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Landmark</span>
                      <span className="font-medium">{property?.location?.landmark}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Agent */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Contact Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{property?.owner?.name || 'Property Agent'}</h3>
                  <p className="text-sm text-muted-foreground">Real Estate Agent</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  {property?.owner?.phoneNumber && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3"
                      onClick={() => window.open(`tel:${property.owner.phoneNumber}`)}
                    >
                      <Phone className="h-4 w-4" />
                      {property.owner.phoneNumber}
                    </Button>
                  )}
                  
                  {property?.owner?.email && (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-3"
                      onClick={() => window.open(`mailto:${property.owner.email}`)}
                    >
                      <Mail className="h-4 w-4" />
                      Send Email
                    </Button>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    onClick={() => router.push(`/edit-property/${property?._id}`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Property
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Visit
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Property Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Features & Amenities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Garden</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>WiFi Ready</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Property Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Views</span>
                    <span className="font-medium">{property?.meta?.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Favorites</span>
                    <span className="font-medium">{property?.meta?.favorites || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Listed</span>
                    <span className="font-medium">{formatDate(property?.createdAt || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Updated</span>
                    <span className="font-medium">{formatDate(property?.updatedAt || '')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mobile Sticky Actions */}
        <div className="fixed bottom-4 left-0 right-0 px-4 md:hidden z-50">
          <div className="mx-auto max-w-screen-sm">
            <Card className="shadow-xl border-0 bg-white/95 backdrop-blur">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-lg">{formatPrice(price)}</div>
                    <div className="text-sm text-muted-foreground capitalize">{status}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={() => window.open(`tel:${property?.owner?.phoneNumber}`)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </AppLayout>
  )
}
