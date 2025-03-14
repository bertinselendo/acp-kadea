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
import { useParams, usePathname } from "next/navigation";
import {
  IoBriefcase,
  IoBriefcaseOutline,
  IoExtensionPuzzle,
  IoExtensionPuzzleOutline,
  IoGrid,
  IoGridOutline,
  IoMailUnread,
  IoMailUnreadOutline,
  IoNotifications,
  IoNotificationsOutline,
} from "react-icons/io5";
import { adminMenuArray, clientMenuArray } from "./main-menu";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import { isTeamMember } from "@/lib/auth/auth-utils";
import { useMediaQuery } from "@/hooks/use-media-query";

type menuType = {
  name: string;
  href: string;
};

export default function MainMenu({ clientID }: { clientID: string }) {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  const iconSize = isSmallDevice ? "1.8em" : "2.2em";
  const pathname = usePathname();
  const params = useParams();
  const session = useSession();

  const user = session.data?.user as User;

  const menuArray = isTeamMember(user)
    ? adminMenuArray()
    : clientMenuArray(clientID);

  if (!user) {
    return (
      <NavigationMenu>
        <NavigationMenuList className="flex-row gap-2 space-x-0 md:flex-col">
          <NavigationMenuItem className="m-0">
            <Skeleton
              className={cn(
                navigationMenuTriggerStyle(),
                "h-8 w-8 p-0 md:h-14 md:w-14",
              )}
            />
          </NavigationMenuItem>
          <NavigationMenuItem className="m-0">
            <Skeleton
              className={cn(
                navigationMenuTriggerStyle(),
                "h-8 w-8 p-0 md:h-14 md:w-14",
              )}
            />
          </NavigationMenuItem>
          <NavigationMenuItem className="m-0">
            <Skeleton
              className={cn(
                navigationMenuTriggerStyle(),
                "h-8 w-8 p-0 md:h-14 md:w-14",
              )}
            />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );
  }

  function isMenuPage(menu: string) {
    if (pathname.includes(menu)) {
      return true;
    }
    return false;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-row gap-2 space-x-0 md:flex-col">
        {menuArray.map((menu: menuType, index: number) => (
          <NavigationMenuItem key={index} className="m-0">
            <Link href={menu.href} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "h-10 w-10 p-0 md:h-14 md:w-14",
                )}
              >
                {(() => {
                  switch (menu.name) {
                    case "dashboard":
                      return pathname == menu.href ? (
                        <IoGrid size={iconSize} />
                      ) : (
                        <IoGridOutline size={iconSize} />
                      );
                    case "clients":
                      return isMenuPage(menu.href) ? (
                        <IoBriefcase size={iconSize} />
                      ) : (
                        <IoBriefcaseOutline size={iconSize} />
                      );
                    case "projects":
                      return isMenuPage(menu.href) ? (
                        <IoBriefcase size={iconSize} />
                      ) : (
                        <IoBriefcaseOutline size={iconSize} />
                      );
                    case "messages":
                      return isMenuPage(menu.href) ? (
                        <IoMailUnread size={iconSize} />
                      ) : (
                        <IoMailUnreadOutline size={iconSize} />
                      );
                    case "activity":
                      return isMenuPage(menu.href) ? (
                        <IoNotifications size={iconSize} />
                      ) : (
                        <IoNotificationsOutline size={iconSize} />
                      );
                    case "team":
                      return isMenuPage(menu.href) ? (
                        <IoExtensionPuzzle size={iconSize} />
                      ) : (
                        <IoExtensionPuzzleOutline size={iconSize} />
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
