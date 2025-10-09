import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full" />
      
      <div className="p-4 space-y-3">
        {/* Title and property type */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        
        {/* Location */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Price and date */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end space-x-2 pt-2">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function PropertySkeletonGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array(8).fill(0).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
}