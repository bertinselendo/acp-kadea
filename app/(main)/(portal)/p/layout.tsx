import ListClients from "@/components/admin/clients/listClients";
import ProjectNavMenu from "@/components/admin/projects/single/projectNavMenu";
import MessagePanel from "@/components/chat/messagePanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function RouteLayout(props: LayoutParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/admin");
  }

  return (
    <div className="h-full relative">
      <div className="px-4 border-b h-14 sticky top-0">
        <ProjectNavMenu />
      </div>
      <div className="flex h-full -mt-14 pt-14 overflow-hidden">
        <div className="py-3 px-6 2xl:w-9/12 md:w-8/12 flex justify-center overflow-y-scroll">
          <div className="w-full flex flex-col items-center">
            {props.children}
          </div>
        </div>
        <div className="p-3 2xl:w-3/12 md:w-4/12 border-l">
          <div className="flex flex-col justify-between h-full relative">
            <MessagePanel user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
