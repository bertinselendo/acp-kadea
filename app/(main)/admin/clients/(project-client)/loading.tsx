import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <Loader />
    </div>
  );
}
