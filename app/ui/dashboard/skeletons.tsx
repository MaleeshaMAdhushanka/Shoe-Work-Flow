export function CardsSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-28 rounded-lg bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
}

export function RevenueChartSkeleton() {
  return (
    <div className="p-6">
      <div className="h-8 w-36 rounded-md bg-gray-200 animate-pulse mb-4" />
      <div className="h-72 rounded-md bg-gray-200 animate-pulse" />
    </div>
  );
}

export function BestSellersSkeleton() {
  return (
    <div className="p-6">
      <div className="h-8 w-36 rounded-md bg-gray-200 animate-pulse mb-4" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-md bg-gray-200 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2" />
              <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function LatestOrdersSkeleton() {
  return (
    <div className="p-6">
      <div className="h-8 w-36 rounded-md bg-gray-200 animate-pulse mb-4" />
      <div className="overflow-hidden">
        <div className="h-12 bg-gray-200 animate-pulse rounded-md mb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-md mb-2" />
        ))}
      </div>
    </div>
  );
}
