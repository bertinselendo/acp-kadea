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
import InvoiceForm from "./invoicesForm";

export type AddInvoiceModalProps = {
  projectID: string;
  variant?: string;
};

export default function AddInvoiceModal(props: AddInvoiceModalProps) {
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
        {variant == "icon" ? <Plus size="14px" /> : "Add invoice"}
      </DialogTrigger>
      <DialogContent className="max-w-[30vw] max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl">Add invoice</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <InvoiceForm projectID={props.projectID} />
      </DialogContent>
    </Dialog>
  );
}
