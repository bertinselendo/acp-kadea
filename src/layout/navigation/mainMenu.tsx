"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoGrid,
  IoGridOutline,
  IoMailUnread,
  IoMailUnreadOutline,
  IoNotifications,
  IoNotificationsOutline,
} from "react-icons/io5";
import { mainMenu } from "./main-menu";
import { useSession } from "next-auth/react";

type menuType = {
  title: string;
  href: string;
};

const menus: menuType[] = mainMenu;

export default function MainMenu() {
  const iconSize = "2.2em";
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

  function isMenuPage(menu: string) {
    if (pathname == baseUrl() + menu) {
      return true;
    }
    return false;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-col gap-2 space-x-0">
        {menus.map((menu: menuType, index: number) => (
          <NavigationMenuItem key={index} className="m-0">
            <Link href={baseUrl() + menu.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "h-14 w-14 p-0")}
              >
                {(() => {
                  switch (menu.title) {
                    case "home":
                      return isMenuPage("") ? (
                        <IoGrid size={iconSize} />
                      ) : (
                        <IoGridOutline size={iconSize} />
                      );
                    case "clients":
                      return isMenuPage("/client") ? (
                        <IoBriefcase size={iconSize} />
                      ) : (
                        <IoBriefcaseOutline size={iconSize} />
                      );
                    case "messages":
                      return pathname == "/client" ? (
                        <IoMailUnread size={iconSize} />
                      ) : (
                        <IoMailUnreadOutline size={iconSize} />
                      );
                    case "activity":
                      return isMenuPage("/activity") ? (
                        <IoNotifications size={iconSize} />
                      ) : (
                        <IoNotificationsOutline size={iconSize} />
                      );
                    default:
                      return <IoBriefcaseOutline size={iconSize} />;
                  }
                })()}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
