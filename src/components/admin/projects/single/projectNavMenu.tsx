"use client";

import { Button } from "@/components/ui/button";
import { clickAnimation } from "@/components/ui/click-animation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Link from "next/link";
import { Settings } from "lucide-react";

const menus = [
  {
    link: "#",
    text: "Feedbacks",
  },
  {
    link: "#",
    text: "Documents",
  },
  {
    link: "#",
    text: "Invoices",
  },
  {
    link: "#",
    text: "Credentials",
  },
];

export type ProjectNavMenuProps = {};

export default function ProjectNavMenu(props: ProjectNavMenuProps) {
  return (
    <div className="flex items-center h-full justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          {menus.map((menu, key) => (
            <NavigationMenuItem key={key}>
              <Button variant="secondary" asChild>
                <Link href={menu.link} onClick={clickAnimation}>
                  {menu.text}
                </Link>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button variant="secondary" onClick={clickAnimation}>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
