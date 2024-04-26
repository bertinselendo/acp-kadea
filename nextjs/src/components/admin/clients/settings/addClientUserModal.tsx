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
import { Client } from "@prisma/client";
import ClientUserForm from "./clientUserForm";

export type AddInvoiceModalProps = {
  client: Client;
};

export default function AddClientUserModal({ client }: AddInvoiceModalProps) {
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
        Add user
      </DialogTrigger>
      <DialogContent className="max-w-[24vw] max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Add user to {client.companyName}
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <ClientUserForm clientID={client.id} />
      </DialogContent>
    </Dialog>
  );
}
