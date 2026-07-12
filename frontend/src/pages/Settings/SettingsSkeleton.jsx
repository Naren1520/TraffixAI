import Skeleton from '../../components/common/Skeleton';

/** Mirrors Settings: page title → profile card → default city → recent searches → account */
const SettingsSkeleton = () => (
  <div className="flex flex-col space-y-8 pb-10 animate-pulse">

    {/* Page title */}
    <div className="space-y-2">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-8 w-28 rounded-md" />
      </div>
      <Skeleton className="h-3 w-52 rounded" />
    </div>

    {/* Profile card */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 space-y-6">
      <Skeleton className="h-3 w-16 rounded" />
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <Skeleton className="h-20 w-20 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-6 w-40 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#050505] border border-[#111] rounded-xl p-4 flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-12 rounded" />
                <Skeleton className="h-4 w-36 rounded" />
              </div>
            </div>
            <div className="bg-[#050505] border border-[#111] rounded-xl p-4 flex items-center space-x-3">
              <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-2.5 w-24 rounded" />
                <Skeleton className="h-4 w-28 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Default city */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 space-y-5">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-24 rounded" />
        <Skeleton className="h-7 w-20 rounded-lg" />
      </div>
      <Skeleton className="h-3 w-64 rounded" />
      <div className="flex items-center space-x-3 bg-[#050505] border border-[#111] rounded-xl px-4 py-4">
        <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
        <div className="space-y-1.5">
          <Skeleton className="h-2.5 w-24 rounded" />
          <Skeleton className="h-5 w-32 rounded" />
        </div>
      </div>
    </div>

    {/* Recent searches */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 space-y-4">
      <Skeleton className="h-3 w-32 rounded" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center justify-between bg-[#050505] border border-[#111] rounded-xl px-4 py-3">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded flex-shrink-0" />
            <Skeleton className="h-3 w-28 rounded" />
          </div>
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      ))}
    </div>

    {/* Account */}
    <div className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl p-6 sm:p-8 space-y-4">
      <Skeleton className="h-3 w-20 rounded" />
      <Skeleton className="h-11 w-32 rounded-xl" />
    </div>

  </div>
);

export default SettingsSkeleton;
