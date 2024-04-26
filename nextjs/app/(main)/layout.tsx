import { getClientByUser } from "@/components/admin/clients/clients.action";
import Header from "@/layout/header";
import SidebarGlobal from "@/layout/sidebar";
import { hasOrganization, isAdmin, isGuest } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import { bgGradient } from "@/lib/utils";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function RouteLayout(props: { children: ReactNode }) {
  const user = await auth();

  if (isGuest(user)) {
    redirect("/no-access");
  }

  if (isAdmin(user)) {
    // redirect the admin who has no organization.
    // this means that the onboarding is not completed
    if (!hasOrganization(user)) {
      redirect("/auth/onboarding?step=organization");
    }
  } else {
    // there's no chance that this will happen but redirect anyway
    if (!hasOrganization(user)) {
      redirect("/no-access");
    }
  }

  const client = await getClientByUser(user?.id);

  return (
    <main className={`${bgGradient().gradient}`}>
      <div
        className={`relative flex h-screen w-screen flex-col overflow-hidden md:flex-row ${
          bgGradient().noise
        }`}
      >
        <SidebarGlobal />
        <div className="flex-auto overflow-hidden">
          <div
            id="main-header"
            className="--border sticky top-0 z-50 flex h-12 items-center justify-between overflow-hidden border-b p-3 md:h-14"
          >
            {user && <Header user={user} clientID={`${client?.id}`} />}
          </div>
          <div className="-mt-12 h-[100vh] pt-12 md:-mt-14 md:pt-14">
            <div className="h-full overflow-y-scroll bg-background/80">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
