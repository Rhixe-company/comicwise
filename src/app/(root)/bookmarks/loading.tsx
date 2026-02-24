import { ComicGridSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="bg-muted h-8 w-40 animate-pulse rounded-md" />
      </div>
      <ComicGridSkeleton count={12} />
    </div>
  );
}
