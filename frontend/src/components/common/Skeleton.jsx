/**
 * Skeleton — base shimmer primitive.
 * Compose these to build any skeleton layout.
 *
 * Usage:
 *   <Skeleton className="h-8 w-40" />
 *   <Skeleton className="h-full w-full rounded-xl" />
 */
const Skeleton = ({ className = '' }) => (
  <div
    className={`bg-[#1A1A1A] rounded-lg animate-pulse ${className}`}
    aria-hidden="true"
  />
);

export default Skeleton;
