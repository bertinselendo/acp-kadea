import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col gap-4 w-[600px] mx-auto">
      <Skeleton className="w-[60%] h-10" />
      <Skeleton className="w-full h-60 delay-200" />
      <Skeleton className="w-full h-60 delay-500" />
    </div>
  );
}
