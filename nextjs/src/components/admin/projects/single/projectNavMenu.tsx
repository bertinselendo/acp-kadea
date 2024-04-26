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
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  FileText,
  MessageCirclePlus,
  Paperclip,
  Settings,
  SquareAsterisk,
} from "lucide-react";
import AddProjectForm from "../addProjectForm";
import Link from "next/link";
import EditProjectForm from "../editProjectForm";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";
import { isTeamManager } from "@/lib/auth/auth-utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";

const menus = [
  {
    link: "/feedbacks",
    text: "Feedbacks",
    icon: <MessageCirclePlus size="1.3em" />,
  },
  {
    link: "/documents",
    text: "Documents",
    icon: <FileText size="1.3em" />,
  },
  {
    link: "/invoices",
    text: "Invoices",
    icon: <Paperclip size="1.3em" />,
  },
  {
    link: "/credentials",
    text: "Credentials",
    icon: <SquareAsterisk size="1.3em" />,
  },
];

export type ProjectNavMenuProps = {
  user: User;
};

export default function ProjectNavMenu(props: ProjectNavMenuProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const { projectID } = useParams();
  const urlBase = `/p/${projectID}`;

  const title = "Edit project";

  return (
    <div className="flex h-full w-full items-center justify-between overflow-hidden">
      <NavigationMenu>
        <NavigationMenuList>
          {menus.map((menu, key) => (
            <NavigationMenuItem key={key}>
              <Button
                variant="secondary"
                className="hover:bg-primary"
                asChild
                size={isDesktop ? "default" : "icon"}
              >
                <Link href={urlBase + menu.link} onClick={clickAnimation}>
                  {menu.icon}
                  {isDesktop ? <span className="ml-2">{menu.text}</span> : ""}
                </Link>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      {isTeamManager(props.user) && (
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {isDesktop ? (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" onClick={clickAnimation}>
                      <Settings size="1.3em" />{" "}
                      {isDesktop ? <span className="ml-2">Settings</span> : ""}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]">
                    <DialogHeader>
                      <DialogTitle className="text-xl">{title}</DialogTitle>
                    </DialogHeader>
                    <EditProjectForm />
                  </DialogContent>
                </Dialog>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger asChild>
                    <Button variant="secondary" onClick={clickAnimation}>
                      <Settings size="1.3em" />{" "}
                      {isDesktop ? <span className="ml-2">Settings</span> : ""}
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle className="text-xl">{title}</DrawerTitle>
                    </DrawerHeader>
                    <EditProjectForm />
                    <DrawerFooter className="pt-2">
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
}
