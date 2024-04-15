import { getClientByUser } from "@/components/admin/clients/clients.action";
import Header from "@/layout/header";
import SidebarGlobal from "@/layout/sidebar";
import { isAdmin, isGuest } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function RouteLayout(props: { children: ReactNode }) {
  const user = await auth();

  if (isGuest(user)) {
    redirect("/no-access");
  }

  const client = await getClientByUser(user?.id);

  return (
    <main className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <div className="flex h-vh relative bg-blend-overlay bg-noise bg-white/80">
        <SidebarGlobal />
        <div className="w-full ">
          <div
            id="main-header"
            className="flex justify-between items-center p-3 h-14 --border border-b sticky top-0 z-50 overflow-hidden"
          >
            {user && <Header user={user} clientID={`${client?.id}`} />}
          </div>
          <div className="h-[100vh] -mt-14 pt-14">
            <div className="bg-background/80 h-full overflow-y-scroll">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
