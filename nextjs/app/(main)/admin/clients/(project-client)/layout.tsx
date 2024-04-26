import ListClients from "@/components/admin/clients/listClients";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { isTeamMember } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function RouteLayout(props: { children: ReactNode }) {
  const user = await auth();
  return (
    <div className="flex h-max flex-col-reverse justify-center overflow-y-scroll md:h-full md:flex-row">
      {isTeamMember(user) && (
        <div className="scroll custom-scrollbar sticky top-0 w-full overflow-y-scroll border-r-0 p-3 pb-20 md:w-4/12 md:border-r 2xl:w-3/12">
          <ListClients />

          <Link href="/admin/clients/create">
            <Button className="mt-4 w-full">Create new client</Button>
          </Link>
        </div>
      )}
      <div className="flex w-full justify-center p-3 md:w-8/12 2xl:w-9/12">
        <div className="2xl:1/2 w-full md:w-4/5 xl:w-2/3">{props.children}</div>
      </div>
    </div>
  );
}
