"use client";

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
import { CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IoAddCircleOutline, IoCloseOutline } from "react-icons/io5";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";
import AddProjectForm from "./addProjectForm";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export type AddProjectModalProps = {
  clientID: string;
};

export default function AddProjectModal(props: AddProjectModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const trigger = "Add project";
  const title = "Create new project";
  const description =
    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.";

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          className={cn(
            navigationMenuTriggerStyle(),
            "w-max rounded-full bg-black text-white hover:bg-gray-800 hover:text-white",
          )}
          onClick={() => {
            clickAnimation;
          }}
        >
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-[60vw] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <AddProjectForm clientID={props.clientID} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "w-max rounded-full bg-black text-white hover:bg-gray-800 hover:text-white",
        )}
        onClick={() => {
          clickAnimation;
        }}
      >
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <AddProjectForm clientID={props.clientID} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
