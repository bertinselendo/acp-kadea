"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
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

import { documentCreationAction } from "./documents.action";
import { Document, Project, User } from "@prisma/client";
import Link from "next/link";
import { getProjectAllUsers } from "../projects/project.action";
import { sendNewDocumentNotification } from "@/jobs/document/new";
import { useSession } from "next-auth/react";
import { getServerUrl } from "@/lib/server-url";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  link: z.string().url(),
});

export type DocumentFormProps = {
  projectID?: string;
  document?: Document;
};

export default function DocumentForm(props: DocumentFormProps) {
  const [type, setType] = useState("internal");
  const session = useSession();
  const currentUser = session?.data?.user as User;

  const documentMutation = useMutation({
    mutationFn: async (values: Document) => {
      if (!props.projectID) return;
      values.type = type as string;
      return await documentCreationAction(values, props.projectID);
    },
    onSuccess: async (data: Document & { project: Project }) => {
      if (props.projectID) {
        const users = await getProjectAllUsers(props.projectID);
        const usersToNotify = users.filter((user) => user.id != data.createdBy);
        const emailsUsers = usersToNotify.map((user) => user.email);

        await sendNewDocumentNotification({
          userEmail: emailsUsers,
          senderEmail: currentUser?.email,
          senderName: currentUser?.firstName ?? "somme one",
          reference: data.project.title,
          link: `${getServerUrl()}/p/${props.projectID}/documents`,
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();
    toast.promise(
      () =>
        new Promise(async (resolve) => {
          const doc = documentMutation.mutateAsync(values as any);
          if (doc) {
            resolve(doc);
          }
        }),
      {
        loading: "Performing...",
        success: "Document saved",
        error: (error) => {
          return error;
        },
      },
    );
  }

  return (
    <div className="px-4 md:px-0">
      <div className="flex w-full flex-col gap-4">
        <div className="mt-4 flex w-full gap-4 *:w-full *:cursor-pointer *:shadow-none *:transition-all *:duration-200 *:ease-in">
          <Card
            className={`hover:bg-primary ${
              type == "internal" && "border-primary bg-primary"
            }`}
            onClick={() => setType("internal")}
          >
            <CardContent className="flex flex-col gap-4 p-6 font-semibold">
              Internal Editor
            </CardContent>
          </Card>
          <Card
            className={`hover:bg-primary ${
              type == "external" && "border-primary bg-primary"
            }`}
            onClick={() => setType("external")}
          >
            <CardContent className="flex flex-col gap-4 p-6 font-semibold">
              External Link
            </CardContent>
          </Card>
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in`}
        style={
          type === "external" ? { display: "initial" } : { display: "none" }
        }
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={
              documentMutation.isPending
                ? "pointer-events-none animate-pulse cursor-wait space-y-8"
                : "space-y-8"
            }
          >
            <Card className="mt-4 w-full shadow-none">
              <CardContent className="flex flex-col gap-4 p-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Document title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://doc.com/a452da6"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Button type="submit" className="mt-4 w-full">
              Add document
            </Button>
          </form>
        </Form>
      </div>
      <div
        className={`overflow-hidden transition-all delay-300 duration-300 ease-in`}
        style={
          type === "internal" ? { display: "initial" } : { display: "none" }
        }
      >
        <Button type="submit" className="mt-4 w-full" asChild>
          <Link href={`/p/${props.projectID}/documents/editor`}>
            Open editor
          </Link>
        </Button>
      </div>
    </div>
  );
}
