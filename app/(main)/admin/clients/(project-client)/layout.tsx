import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function RouteLayout(props: LayoutParams<{}>) {
  return (
    <div className="flex h-[90vh] overflow-scroll">
      <div className="sticky top-0 overflow-scroll w-3/12 p-3 border-r">
        sdebar
        <Skeleton className="h-screen" />
      </div>
      <div className="p-3 w-9/12 flex justify-center">
        <div className="w-1/2">
          {props.children}
          <Skeleton className="h-screen" />
        </div>
      </div>
    </div>
  );
}
