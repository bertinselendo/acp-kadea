import ListClients from "@/components/admin/clients/listClients";
import ProjectNavMenu from "@/components/admin/projects/single/projectNavMenu";
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
    <div>
      <div className="px-4 border-b h-14">
        <ProjectNavMenu />
      </div>
      <div className="flex">
        <div className="py-3 px-6 2xl:w-9/12 md:w-8/12 flex justify-center h-[85vh] overflow-scroll">
          <div className="w-full">{props.children}</div>
        </div>
        <div className="p-3 2xl:w-3/12 md:w-4/12 border-l">
          <div className="flex flex-col justify-between h-full">
            <div>Chat..</div>
            <div>
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
