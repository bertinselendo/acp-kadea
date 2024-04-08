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
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { teamDeleteAction } from "./members.action";
import { cn } from "@/lib/utils";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { clickAnimation } from "@/components/ui/click-animation";

export type DeleteMemberModalProps = {
  member: {
    id: string;
    firstName: string;
  };
};

export function DeleteMemberAlert(props: DeleteMemberModalProps) {
  const userID = props.member.id;
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const user = await teamDeleteAction(userID);

      if (!user) {
        toast.dismiss();
        toast.error("Process Error", {
          description: "Please wait and retry",
          duration: 10000,
        });
      }

      return user;
    },
    onSuccess(data) {
      if (data) {
        toast.dismiss();
        toast.success(`${props.member.firstName} was deleted`, {
          description: "You will be redirect... ",
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 3000);
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
            Yes Delete {props.member.firstName}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
