import Skeleton from '../../components/common/Skeleton';

/** Mirrors RouteAnalyzer: page title → search box → (after search) best route card → map+details */
const RouteAnalyzerSkeleton = () => (
  <div className="flex flex-col space-y-8 pb-10 animate-pulse">

    {/* Page title */}
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>
      <Skeleton className="h-3 w-56 rounded" />
    </div>

    {/* Search box */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Skeleton className="h-3 w-16 rounded" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24 rounded" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>

    {/* Best route card */}
    <div className="bg-[#050505] border border-[#1A1A1A] rounded-2xl p-8 space-y-6">
      <div className="flex items-start space-x-4">
        <Skeleton className="h-6 w-6 rounded flex-shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-40 rounded" />
          <Skeleton className="h-7 w-64 rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-16 rounded" />
            <Skeleton className="h-7 w-20 rounded-md" />
          </div>
        ))}
      </div>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-xl p-5 space-y-2">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-4/5 rounded" />
      </div>
    </div>

    {/* Map + route details */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Skeleton className="lg:col-span-2 h-[420px] rounded-2xl" />
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
        <Skeleton className="h-4 w-28 rounded" />
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-[#1A1A1A] rounded-xl p-4 space-y-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-3 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default RouteAnalyzerSkeleton;
