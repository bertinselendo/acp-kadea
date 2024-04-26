import type { PageParams } from "@/types/next";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loadng(props: PageParams<{}>) {
  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-5/12 gap-4">
        <Skeleton className="w-[60%] h-10" />
        <Skeleton className="w-full h-60" />
        <Skeleton className="w-full h-60" />
      </div>
    </div>
  );
}
