import { Loader } from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex justify-center items-center p-40">
      <Loader />
    </div>
  );
}
