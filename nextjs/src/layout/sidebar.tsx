import { PropsWithChildren } from "react";
import MainMenu from "./navigation/mainMenu";
import { auth } from "@/lib/auth/helper";
import MainLogo from "./navigation/mainLogo";
import SidebarUser from "./navigation/sidebarUser";
import { getClientByUser } from "@/components/admin/clients/clients.action";

export default async function SidebarGlobal(props: PropsWithChildren) {
  const user = await auth();

  if (!user) {
    return;
  }

  const client = await getClientByUser(user.id);

  return (
    <>
      <div className="--border absolute bottom-0 z-50 flex h-max w-full flex-none flex-row justify-between border border-r bg-white p-2 md:sticky md:top-0 md:h-screen md:w-max md:flex-col md:border-none md:bg-transparent">
        <div>
          <MainLogo />
        </div>
        <div>
          <MainMenu clientID={`${client?.id}`} />
        </div>
        <div>
          <SidebarUser src={user.avatar as string} />
        </div>
      </div>
    </>
  );
}
