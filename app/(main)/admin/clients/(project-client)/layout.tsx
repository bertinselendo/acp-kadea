import ListClients from "@/components/admin/clients/listClients";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function RouteLayout(props: LayoutParams<{}>) {
  return (
    <div className="flex h-full overflow-y-scroll">
      <div className="sticky top-0 overflow-y-scroll scroll custom-scrollbar 2xl:w-3/12 md:w-4/12 p-3 border-r">
        <ListClients />
        <Button className="w-full mt-4">
          <Link href="/admin/clients/create">Create new client</Link>
        </Button>
      </div>
      <div className="p-3 2xl:w-9/12 md:w-8/12 flex justify-center">
        <div className="md:w-2/3 2xl:1/2">{props.children}</div>
      </div>
    </div>
  );
}
