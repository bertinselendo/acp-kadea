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
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";
import AddFeedbackForm from "./addFeedbackForm";
import { Plus } from "lucide-react";

export type AddFeedbackModalProps = {
  projectID: string;
};

export default function AddFeedbackModal(props: AddFeedbackModalProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(navigationMenuTriggerStyle(), "p-2 h-fit")}
        onClick={() => {
          clickAnimation;
        }}
      >
        <Plus size="14px" />
      </DialogTrigger>
      <DialogContent className="max-w-[30vw] max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl">Add feedback</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <AddFeedbackForm projectID={props.projectID} />
      </DialogContent>
    </Dialog>
  );
}
