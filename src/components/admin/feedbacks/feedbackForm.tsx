"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
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

import { Textarea } from "@/components/ui/textarea";

import {
  feedbackCreationAction,
  feedbackUpdatetAction,
} from "./feedback.action";
import { Feedback, Project, User } from "@prisma/client";
import { getProjectAllUsers } from "../projects/project.action";
import { sendNewFeedbackNotification } from "@/jobs/feedback/new";
import { useSession } from "next-auth/react";
import { getServerUrl } from "@/lib/server-url";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  link: z.string().url(),
  note: z.string().optional(),
});

export type FeedbackFormProps = {
  projectID?: string;
  feedback?: Feedback;
};

export default function FeedbackForm(props: FeedbackFormProps) {
  const router = useRouter();
  const session = useSession();
  const currentUser = session?.data?.user as User;

  const feedbackMutation = useMutation({
    mutationFn: async (values) => {
      if (props.projectID) {
      }

      const feedback = props.projectID
        ? await feedbackCreationAction(values as any, props.projectID)
        : props.feedback
        ? await feedbackUpdatetAction(values as any, props.feedback.id)
        : false;

      if (!feedback) {
        toast.dismiss();
        toast.error("Process Error", {
          description: "Please wait and retry",
          duration: 10000,
        });
      }

      return feedback;
    },
    onSuccess: async (data: Feedback & { project: Project }) => {
      if (data) {
        if (props.projectID) {
          const users = await getProjectAllUsers(props.projectID);
          const usersToNotify = users.filter(
            (user) => user.id != data.createdBy
          );
          const emailsUsers = usersToNotify.map((user) => user.email);

          await sendNewFeedbackNotification({
            userEmail: emailsUsers,
            senderEmail: currentUser?.email,
            senderName: currentUser?.firstName ?? "somme one",
            reference: data.project.title,
            link: `${getServerUrl()}/p/${props.projectID}/feedbacks`,
          });
        }

        setTimeout(() => {
          if (props.projectID) {
            router.push(`/p/${props.projectID}/feedbacks`);
          } else {
            window.location.reload();
          }
        }, 1000);
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      link: "",
      note: "",
    },
  });

  useEffect(() => {
    if (props.feedback) {
      const data = props.feedback;
      form.reset({
        title: data.title,
        link: data.link,
        note: data.note as string,
      });
    }
  }, [form, props.feedback]);

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.promise(
      new Promise(async (resolve) => {
        const feedback = feedbackMutation.mutateAsync(values as any);
        if (feedback) {
          resolve(feedback);
          return feedback;
        }
      }),
      {
        loading: "Please wait...",
        success: "Action successfull<br>You will be redirect",
        error: (error) => {
          return error;
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          feedbackMutation.isPending
            ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
            : "space-y-8"
        }
      >
        <div className="flex gap-4 w-full">
          <Card className="mt-4 w-full shadow-none">
            <CardContent className="p-6 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project title" {...field} />
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
                    <FormLabel>Lien</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://website.com/a452da6"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Comment this link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <Button type="submit" className="w-full mt-4">
          {props.projectID ? "Create feedback" : "Update details"}
        </Button>
      </form>
    </Form>
  );
}
