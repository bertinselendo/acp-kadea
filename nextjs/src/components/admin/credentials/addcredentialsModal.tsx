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
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";
import { Plus } from "lucide-react";
import CredentialForm from "./credentialForm";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type AddCredentialModalProps = {
  projectID: string;
  variant?: string;
};

export default function AddcredentialsModal(props: AddCredentialModalProps) {
  const variant = props.variant;

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const trigger = "Add new";
  const title = "Add credential";
  const description =
    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.";

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger
          className={cn(
            navigationMenuTriggerStyle(),
            `${
              variant == "icon"
                ? "h-fit p-2"
                : "w-max rounded-full bg-black text-white hover:bg-gray-800 hover:text-white"
            }`,
          )}
          onClick={() => {
            clickAnimation;
          }}
        >
          {variant == "icon" ? <Plus size="14px" /> : trigger}
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-[40vw] overflow-scroll xl:max-w-[30vw]">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <CredentialForm projectID={props.projectID} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          `${
            variant == "icon"
              ? "h-fit p-2"
              : "w-max rounded-full bg-black text-white hover:bg-gray-800 hover:text-white"
          }`,
        )}
        onClick={() => {
          clickAnimation;
        }}
      >
        {variant == "icon" ? <Plus size="14px" /> : trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <CredentialForm projectID={props.projectID} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
