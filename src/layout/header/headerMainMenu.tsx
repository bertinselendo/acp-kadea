"use client";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoGrid,
  IoMailUnread,
  IoNotifications,
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import { mainMenu } from "../navigation/main-menu";

type menuType = {
  title: string;
  href: string;
};

const menus: menuType[] = mainMenu;

export default function HeaderMainMenu() {
  const iconSize = "1.3em";
  const pathname = usePathname();
  const session = useSession();

  const user = session.data?.user;

  if (!user) {
    return;
  }

  const baseUrl = () => {
    const role = user?.role;
    let baseUrl = "/";
    if (role == "ADMIN" || role == "MANAGER" || role == "WORKER") {
      baseUrl = "/admin";
    }
    return baseUrl;
  };

  return (
    <>
      <ul>
        {menus.map((menu: menuType, index: number) => (
          <li key={index}>
            <Link
              href={baseUrl() + menu.href}
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
                  switch (menu.title) {
                    case "home":
                      return <IoGrid size={iconSize} />;
                    case "clients":
                      return <IoBriefcase size={iconSize} />;
                    case "messages":
                      return <IoMailUnread size={iconSize} />;
                    case "activity":
                      return <IoNotifications size={iconSize} />;
                    default:
                      return <IoBriefcaseOutline size={iconSize} />;
                  }
                })()}
                <span className="ml-2 cursor-pointer">
                  {menu.title.charAt(0).toUpperCase() + menu.title.slice(1)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
