"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IoAddCircleOutline, IoCloseOutline } from "react-icons/io5";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";
import AddProjectForm from "./addProjectForm";

export type AddProjectModalProps = {
  clientID: string;
};

export default function AddProjectModal(props: AddProjectModalProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "bg-black text-white w-max hover:bg-gray-800 rounded-full hover:text-white"
        )}
        onClick={() => {
          clickAnimation;
        }}
      >
        Add project
      </DialogTrigger>
      <DialogContent className="max-w-[60vw] max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl">Create new project</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <AddProjectForm clientID={props.clientID} />
      </DialogContent>
    </Dialog>
  );
}
