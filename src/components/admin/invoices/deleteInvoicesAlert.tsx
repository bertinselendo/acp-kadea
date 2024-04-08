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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { clickAnimation } from "@/components/ui/click-animation";
import { Invoice } from "@prisma/client";
import { invoiceDeleteAction } from "./invoices.action";

type DeleteInvoiceProps = {
  invoice: Invoice;
};

export function DeleteInvoiceAlert(props: DeleteInvoiceProps) {
  const invoiceID = props.invoice.id;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await invoiceDeleteAction(invoiceID);
    },
    onSuccess(data) {
      setTimeout(() => {
        data && window.location.reload();
      }, 2000);
    },
  });

  async function onSubmit(event: any) {
    event.preventDefault();

    toast.promise(
      () =>
        new Promise((resolve) => {
          const invoice = deleteMutation.mutateAsync();

          if (invoice) {
            resolve(invoice);
          }
        }),
      {
        loading: "Deleting...",
        success: "Invoice was deleted",
        error: (error) => {
          return error;
        },
      }
    );
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "w-full flex justify-start p-2 text-red-700"
        )}
        onClick={clickAnimation}
      >
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            member and remove all his data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onSubmit}
            className="bg-red-600 text-white hover:bg-red-700 hover:text-white"
          >
            Yes Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
