import Skeleton from '../../components/common/Skeleton';

/** Mirrors IncidentCenter: header → 4 stat cards → filter pills → map+feed → AI insights */
const IncidentCenterSkeleton = () => (
  <div className="flex flex-col space-y-8 pb-10 animate-pulse">

    {/* Page header */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-5 lg:p-8 space-y-2">
      <Skeleton className="h-7 w-64 rounded-md" />
      <Skeleton className="h-3 w-80 rounded" />
    </div>

    {/* 4 stat cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-3">
            <Skeleton className="h-3 w-28 rounded" />
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>

    {/* Filter pills */}
    <div className="flex space-x-2 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-lg flex-shrink-0" />
      ))}
    </div>

    {/* Map + incident feed */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Skeleton className="lg:col-span-2 min-h-[420px] rounded-2xl" />
      <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
            <Skeleton className="h-3 w-24 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
            <div className="pt-2 border-t border-[#111] flex justify-between">
              <Skeleton className="h-3 w-28 rounded" />
              <Skeleton className="h-3 w-16 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* AI insights */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 lg:p-8 space-y-6">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-4 w-40 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-[#050505] border border-[#1A1A1A] rounded-xl p-5 space-y-2">
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-3 w-full rounded" />
            <Skeleton className="h-3 w-5/6 rounded" />
            <Skeleton className="h-3 w-4/5 rounded" />
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default IncidentCenterSkeleton;
