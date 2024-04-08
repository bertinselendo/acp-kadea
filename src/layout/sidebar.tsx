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
      <div className="flex flex-col justify-between p-2 --border border-r sticky top-0 h-screen">
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
