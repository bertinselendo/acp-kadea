"use client";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoExtensionPuzzle,
  IoGrid,
  IoMailUnread,
  IoNotifications,
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import { adminMenuArray, clientMenuArray } from "../navigation/main-menu";
import { User } from "@prisma/client";
import { isTeamMember } from "@/lib/auth/auth-utils";

type menuType = {
  name: string;
  href: string;
};

export default function HeaderMainMenu({ clientID }: { clientID: string }) {
  const iconSize = "1.3em";
  const session = useSession();

  const user = session.data?.user as User;

  const menuArray = isTeamMember(user)
    ? adminMenuArray()
    : clientMenuArray(clientID);

  if (!user) {
    return;
  }

  return (
    <>
      <ul>
        {menuArray.map((menu: menuType, index: number) => (
          <li key={index}>
            <Link
              href={menu.href}
              className="cursor-pointer"
              legacyBehavior
              passHref
            >
              <div
                className={cn(
                  navigationMenuTriggerStyle(),
                  "flex justify-start h-10 w-full px-2"
                )}
              >
                {(() => {
                  switch (menu.name) {
                    case "dashboard":
                      return <IoGrid size={iconSize} />;
                    case "clients":
                      return <IoBriefcase size={iconSize} />;
                    case "projects":
                      return <IoBriefcase size={iconSize} />;
                    case "messages":
                      return <IoMailUnread size={iconSize} />;
                    case "activity":
                      return <IoNotifications size={iconSize} />;
                    case "team":
                      return <IoExtensionPuzzle size={iconSize} />;
                    default:
                      return <IoBriefcaseOutline size={iconSize} />;
                  }
                })()}
                <span className="ml-2 cursor-pointer">
                  {menu.name.charAt(0).toUpperCase() + menu.name.slice(1)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
