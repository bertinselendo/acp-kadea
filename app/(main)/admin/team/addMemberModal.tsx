"use client";

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
import AddMemberForm from "./addMemberForm";
import { IoAddCircleOutline, IoCloseOutline } from "react-icons/io5";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";

export type AddMemberModalProps = {};

export default function AddMemberModal(props: AddMemberModalProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(navigationMenuTriggerStyle(), "h-10 w-10 p-0")}
        onClick={() => {
          clickAnimation;
        }}
      >
        <IoAddCircleOutline size="1.6em" />
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create new team member</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <AddMemberForm />
      </DialogContent>
    </Dialog>
  );
}
