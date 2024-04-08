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
import { Feedback } from "@prisma/client";
import FeedbackForm from "./feedbackForm";

export type AddFeedbackModalProps = {
  feedback: Feedback;
};

export default function EditFeedbackModal(props: AddFeedbackModalProps) {
  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "w-full flex justify-start p-2 h-fit"
        )}
        onClick={() => {
          clickAnimation;
        }}
      >
        Edit
      </DialogTrigger>
      <DialogContent className="max-w-[30vw] max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit feedback</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <FeedbackForm feedback={props.feedback} />
      </DialogContent>
    </Dialog>
  );
}
