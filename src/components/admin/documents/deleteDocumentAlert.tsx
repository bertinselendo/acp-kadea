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
import { Document } from "@prisma/client";
import { documentDeleteAction } from "./documents.action";

type DeleteDocumentProps = {
  document: Document;
};

export function DeleteDocumentAlert(props: DeleteDocumentProps) {
  const documentID = props.document.id;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await documentDeleteAction(documentID);
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
          const document = deleteMutation.mutateAsync();

          if (document) {
            resolve(document);
          }
        }),
      {
        loading: "Deleting...",
        success: "Document was deleted",
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
