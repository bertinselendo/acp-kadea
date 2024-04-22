"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Client } from "@prisma/client";
import { deleteClient } from "../clients.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function DeleteClientAlert({ client }: { client: Client }) {
  const [inputValue, setInputValue] = useState("");
  const router = useRouter();

  const clientID = client.id;
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const user = await deleteClient(clientID);

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
      setTimeout(() => {
        window.location.assign("/admin/clients");
      }, 1000);
    },
  });

  async function onSubmit(event: any) {
    event.preventDefault();

    toast.promise(
      () =>
        new Promise(async (resolve) => {
          const user = await deleteMutation.mutateAsync();
          if (user) {
            resolve(user);
          }
        }),
      {
        loading: "Deleting...",
        success: "Client deleted<br> You will be redirect",
        error: (error) => {
          return error;
        },
      }
    );
  }
  return (
    <Card className="border-red-400">
      <CardHeader>
        <CardTitle>Are you absolutely sure ?</CardTitle>
      </CardHeader>
      <CardContent>
        This action cannot be undone. This will permanently delete the client
        and remove all his data and users.
      </CardContent>
      <CardFooter className="gap-6">
        <Input
          name="confirmName"
          placeholder="Enter client name to delete"
          onChange={(event) => setInputValue(event.currentTarget.value)}
        />
        <Button
          onClick={onSubmit}
          className={cn(
            "w-full rounded-lg bg-red-600 text-white hover:bg-red-700 hover:text-white",
            inputValue.toLowerCase() != client.companyName.toLowerCase() &&
              "opacity-50 pointer-events-none"
          )}
        >
          Yes Delete {client.companyName}
        </Button>
      </CardFooter>
    </Card>
  );
}
