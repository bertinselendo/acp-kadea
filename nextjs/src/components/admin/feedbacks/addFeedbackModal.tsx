"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";
import { Plus } from "lucide-react";
import FeedbackForm from "./feedbackForm";

export type AddFeedbackModalProps = {
  projectID: string;
  variant?: string;
};

export default function AddFeedbackModal(props: AddFeedbackModalProps) {
  const variant = props.variant;

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          `${
            variant == "icon"
              ? "p-2 h-fit"
              : "bg-black text-white w-max hover:bg-gray-800 rounded-full hover:text-white"
          }`
        )}
        onClick={() => {
          clickAnimation;
        }}
      >
        {variant == "icon" ? <Plus size="14px" /> : "Add project"}
      </DialogTrigger>
      <DialogContent className="max-w-[30vw] max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl">Add feedback</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm projectID={props.projectID} />
      </DialogContent>
    </Dialog>
  );
}
