"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Client, User } from "@prisma/client";
import { createClientUser } from "../clients.action";
import { sendClientAddNotification } from "@/jobs/client/add-client";
import { useSession } from "next-auth/react";
import { getServerUrl } from "@/lib/server-url";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  email: z.string().email(),
});

export default function ClientUserForm({ clientID }: { clientID: string }) {
  const session = useSession();
  const currentUser = session?.data?.user as User;

  const userMutation = useMutation({
    mutationFn: async (values: User) => {
      return await createClientUser(values, clientID);
    },
    onSuccess: async (data: User & { client: Client }) => {
      if (data) {
        await sendClientAddNotification({
          userEmail: [data.email],
          senderEmail: currentUser?.email,
          senderName: currentUser?.firstName ?? "somme one",
          reference: data.client.companyName,
          link: `${getServerUrl()}/admin/clients/${data.clientId}`,
        });
        window.location.reload();
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.promise(
      () =>
        new Promise(async (resolve) => {
          const user = userMutation.mutateAsync(values as any);
          if (user) {
            resolve(user);
          }
        }),
      {
        loading: "creating...",
        success: "User created",
        error: (error) => {
          return error;
        },
      }
    );
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={
            userMutation.isPending
              ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
              : "space-y-8"
          }
        >
          <Card className="shadow-none col-span-8">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">firstName</FormLabel>
                      <FormControl>
                        <Input placeholder="firstName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">lastName</FormLabel>
                      <FormControl>
                        <Input placeholder="lasttName" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="hidden">Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Button type="submit" className="w-full">
            Add user
          </Button>
        </form>
      </Form>
    </div>
  );
}
