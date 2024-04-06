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

import { Settings } from "lucide-react";
import AddProjectForm from "../addProjectForm";
import Link from "next/link";
import EditProjectForm from "../editProjectForm";
import { useParams } from "next/navigation";
import { User } from "@prisma/client";
import { isTeamManager } from "@/lib/auth/auth-utils";

const menus = [
  {
    link: "/feedbacks",
    text: "Feedbacks",
  },
  {
    link: "/documents",
    text: "Documents",
  },
  {
    link: "#",
    text: "Invoices",
  },
  {
    link: "/credentials",
    text: "Credentials",
  },
];

export type ProjectNavMenuProps = {
  user: User;
};

export default function ProjectNavMenu(props: ProjectNavMenuProps) {
  const { projectID } = useParams();
  const urlBase = `/p/${projectID}`;

  return (
    <div className="flex items-center h-full justify-between">
      <NavigationMenu>
        <NavigationMenuList>
          {menus.map((menu, key) => (
            <NavigationMenuItem key={key}>
              <Button variant="secondary" className="hover:bg-primary" asChild>
                <Link href={urlBase + menu.link} onClick={clickAnimation}>
                  {menu.text}
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" onClick={clickAnimation}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[60vw] max-h-[80vh] overflow-scroll">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Edit project</DialogTitle>
                  </DialogHeader>
                  <EditProjectForm />
                </DialogContent>
              </Dialog>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )}
    </div>
  );
}
