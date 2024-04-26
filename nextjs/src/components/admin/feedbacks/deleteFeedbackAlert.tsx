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
import { Feedback } from "@prisma/client";
import { feedbackDeleteAction } from "./feedback.action";

type DeleteFeedbackProps = {
  feedback: Feedback;
};

export function DeleteFeedbackAlert(props: DeleteFeedbackProps) {
  const feedbackID = props.feedback.id;

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const feedback = await feedbackDeleteAction(feedbackID);

      if (!feedback) {
        toast.dismiss();
        toast.error("Process Error", {
          description: "Please wait and retry",
          duration: 10000,
        });
      }

      return feedback;
    },
    onSuccess(data) {
      if (data) {
        toast.dismiss();
        toast.success(`Feedback was deleted`, {
          description: "You will be redirect... ",
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  async function onSubmit(event: any) {
    event.preventDefault();

    toast.loading("Deleting...");
    deleteMutation.mutateAsync();
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
