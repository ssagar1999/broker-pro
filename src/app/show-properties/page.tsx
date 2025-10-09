"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AppLayout } from "../../components/layout/app-layout";
import { type BrokerData } from "../../lib/api/types";
import { Trash2, MapPin, Calendar, Search, SlidersHorizontal, Heart, Star, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getStatusColor, formatPrice, formatDate } from "@/lib/utils";
import useUserStore from "../../lib/store/userStore";
import { getAllProperties } from "@/lib/api/propertiesApi";

export default function ListDataPage() {
  const router = useRouter();
  const [data, setData] = useState<BrokerData[]>([]);
  const [filteredData, setFilteredData] = useState<BrokerData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const userId = useUserStore((state) => state.userId);
  const [loading, setLoading] = useState(false); // For loading state
     console.log('no of times page rendered');

  // Fetch properties based on the userId
  useEffect(() => {
    const fetchData = async () => {
      console.log(userId, 'render times');
      setLoading(true); // Start loading
      try {
        const properties = await getAllProperties({ brokerId: userId });

        setData(properties);
        setFilteredData(properties);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchData();
  }, [userId]);

  // Filtering logic
  useEffect(() => {
    let result = [...data];

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (item) =>
          item?.owner?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.location?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.propertyType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatuses.length > 0) {

      // result = result.filter((item) => selectedStatuses.includes(item.isActive));
      result = result.filter((item) => selectedStatuses.includes(item.status));
    }

    // Property type filter
    if (selectedPropertyTypes.length > 0) {
      result = result.filter((item) => selectedPropertyTypes.includes(item.propertyType));
    }

    // Price range filter
    if (priceRange.min) {
      result = result.filter((item) => item.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter((item) => item.price <= Number(priceRange.max));
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "recent":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    setFilteredData(result);
  }, [data, searchQuery, sortBy, selectedStatuses, selectedPropertyTypes, priceRange]);

  // Handle delete
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      try {
        // await deleteData(id);
        setData(data.filter((item) => item._id !== id));
        setFilteredData(filteredData.filter((item) => item._id !== id));
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  // Handle favorite toggle
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatuses([]);
    setSelectedPropertyTypes([]);
    setPriceRange({ min: "", max: "" });
  };

  const removeStatusFilter = (status: string) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };
  const toggleStatusFilter = (status: string) => {
      setSelectedStatuses((prev) =>
    prev.includes(status)
      ? prev.filter((t) => t !== status) // remove if already selected
      : [...prev, status]                // add if not selected
  );
  };

  const removePropertyTypeFilter = (type: string) => {
    setSelectedPropertyTypes((prev) => prev.filter((t) => t !== type));
  };
 const togglePropertyTypeFilter = (type: string) => {
  setSelectedPropertyTypes((prev) =>
    prev.includes(type)
      ? prev.filter((t) => t !== type) // remove if already selected
      : [...prev, type]                // add if not selected
  );
};
  

  const clearPriceRange = () => {
    setPriceRange({ min: "", max: "" });
  };

  const activeFilterCount =
    selectedStatuses.length + selectedPropertyTypes.length + (priceRange.min || priceRange.max ? 1 : 0);

  const uniquePropertyTypes = Array.from(new Set(data.map((item) => item.propertyType)));

  return (
    <AppLayout title="list Data" description="These are places available">
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold">Properties</h1>
                <p className="text-muted-foreground">
                  Showing {filteredData.length} of {data.length} properties
                </p>
              </div>
              <Button onClick={() => router.push("/add-property")}>Add New Property</Button>
            </div>

            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="relative flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by client, location, or property type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
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

                <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="relative bg-transparent">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs" variant="default">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription>Refine your property search with filters below</SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                      {/* Status Filter */}
                      <div>
                        <h3 className="mb-3 text-sm font-medium">Status</h3>
                        <div className="space-y-2">
                          {["available", "booked", "unavailable"].map((status) => (
                            <div key={status} className="flex items-center space-x-2">
                              <Checkbox
                                id={`status-${status}`}
                                checked={selectedStatuses.includes(status)}
                                onCheckedChange={() => toggleStatusFilter(status)}
                              />
                              <label
                                htmlFor={`status-${status}`}
                                className="text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {status}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Property Type Filter */}
                      {uniquePropertyTypes.length > 0 && (
                        <div>
                          <h3 className="mb-3 text-sm font-medium">Property Type</h3>
                          <div className="space-y-2">
                            {uniquePropertyTypes.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`type-${type}`}
                                  checked={selectedPropertyTypes.includes(type)}
                                  onCheckedChange={() => togglePropertyTypeFilter(type)}
                                />
                                <label
                                  htmlFor={`type-${type}`}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price Range Filter */}
                      <div>
                        <h3 className="mb-3 text-sm font-medium">Price Range</h3>
                        <div className="space-y-2">
                          <Input
                            type="number"
                            placeholder="Min price"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          />
                          <Input
                            type="number"
                            placeholder="Max price"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          />
                        </div>
                      </div>

                      {/* Clear filters button */}
                      {activeFilterCount > 0 && (
                        <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedStatuses.map((status) => (
                  <Badge key={status} variant="secondary" className="gap-1">
                    <span className="capitalize">{status}</span>
                    <button onClick={() => removeStatusFilter(status)} className="ml-1 hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {selectedPropertyTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="gap-1">
                    {type}
                    <button onClick={() => removePropertyTypeFilter(type)} className="ml-1 hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {(priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="gap-1">
                    {priceRange.min && `$${priceRange.min}`}
                    {priceRange.min && priceRange.max && " - "}
                    {priceRange.max && `$${priceRange.max}`}
                    <button onClick={clearPriceRange} className="ml-1 hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                  Clear all
                </Button>
              </div>
            )}
          </div>

          <div>
            {filteredData.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="mb-4 text-muted-foreground">
                    {data.length === 0 ? "No properties yet" : "No properties match your filters"}
                  </p>
                  {data.length === 0 ? (
                    <Button onClick={() => router.push("/add-property")}>Add Your First Property</Button>
                  ) : (
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredData.map((item) => (
                  <Card key={item._id} className="group relative overflow-hidden transition-shadow hover:shadow-lg">
                    {/* Property Image Placeholder */}
                    <div style={{ backgroundImage: `url(${item.images[0]})` }} className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="mx-auto mb-2 h-12 w-12 text-muted-foreground/30" />
                          <p className="text-xs text-muted-foreground/50">Property Image</p>
                        </div>
                      </div>

                      {/* Favorite Badge */}
                      <button
                        onClick={() => toggleFavorite(item._id)}
                        className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.has(item._id) ? "fill-red-500 text-red-500" : "text-slate-600"
                          }`}
                        />
                      </button>

                      {/* Status Badge */}
                      <div className="absolute left-3 top-3">
                        <Badge className={getStatusColor(item.isActive)} variant="secondary">
                          {item.isActive}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold leading-tight text-foreground">{item.owner.name}</h3>
                          <p className="text-sm text-muted-foreground">{item.propertyType}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium">4.8</span>
                        </div>
                      </div>

                      <div className="mb-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{item.location.address}</span>
                      </div>

                      <div className="mb-3 flex items-baseline gap-1">
                        <span className="text-lg font-bold text-foreground">{formatPrice(item.price)}</span>
                        <span className="text-xs text-muted-foreground">total</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      {item.notes && <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{item.notes}</p>}

                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          View Details {item.status || 'dunno'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AppLayout>
  );
}
