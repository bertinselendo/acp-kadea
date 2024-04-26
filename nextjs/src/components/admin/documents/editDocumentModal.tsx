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
import { Document } from "@prisma/client";
import EditDocumentForm from "./editDocumentForm";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export type AddDocumentModalProps = {
  document: Document;
};

export default function EditDocumentModal(props: AddDocumentModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = useState(false);

  const title = "Edit document";
  const description =
    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.";

  if (isDesktop) {
    return (
      <Dialog>
        <DialogTrigger
          className={cn(
            navigationMenuTriggerStyle(),
            "flex h-fit w-full justify-start p-2",
          )}
          onClick={() => {
            clickAnimation;
          }}
        >
          Edit
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] max-w-[40vw] overflow-scroll sm:xl:max-w-[30vw]">
          <DialogHeader>
            <DialogTitle className="text-xl">{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <EditDocumentForm document={props.document} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "flex h-fit w-full justify-start p-2",
        )}
        onClick={() => {
          clickAnimation;
        }}
      >
        Edit
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <EditDocumentForm document={props.document} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
