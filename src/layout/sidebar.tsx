import { PropsWithChildren } from "react";
import MainMenu from "./navigation/mainMenu";
import { auth } from "@/lib/auth/helper";
import MainLogo from "./navigation/mainLogo";
import SidebarUser from "./navigation/sidebarUser";

export default async function SidebarGlobal(props: PropsWithChildren) {
  const user = await auth();

  if (!user) {
    return;
  }

  return (
    <>
      <div className="flex flex-col justify-between p-2 --border border-r">
        <div>
          <MainLogo />
        </div>
        <div>
          <MainMenu />
        </div>
        <div>
          <SidebarUser src={user.avatar as string} />
        </div>
      </div>
    </>
  );
}
