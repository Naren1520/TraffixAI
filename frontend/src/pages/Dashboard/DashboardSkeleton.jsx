import Skeleton from '../../components/common/Skeleton';

/** Mirrors the exact Dashboard layout: header → 3 stat cards → map+chart → 2 route tables → alerts */
const DashboardSkeleton = () => (
  <div className="flex flex-col space-y-8 pb-10 animate-pulse">

    {/* Header bar */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 lg:p-8 flex flex-col sm:flex-row justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-28 rounded-md" />
        <Skeleton className="h-3 w-52 rounded" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-52 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>

    {/* 3 stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>

    {/* Map + chart */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-[420px] rounded-2xl" />
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    </div>

    {/* Route tables */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
          <Skeleton className="h-4 w-40 rounded" />
          {[...Array(5)].map((_, j) => (
            <div key={j} className="flex justify-between items-center py-3 border-b border-[#111]">
              <div className="flex items-center space-x-3">
                <Skeleton className="h-3 w-6 rounded" />
                <Skeleton className="h-3 w-40 rounded" />
              </div>
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Alerts panel */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-6">
      <Skeleton className="h-4 w-32 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="pl-4 border-l border-[#222] space-y-2">
            <Skeleton className="h-3 w-32 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default DashboardSkeleton;
