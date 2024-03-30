"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

import { Textarea } from "@/components/ui/textarea";

import { feedbackCreationAction } from "./feedback.action";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  link: z.string().url(),
  note: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
});

export type AddFeedbackFormProps = {
  projectID: string;
};

export default function AddFeedbackForm(props: AddFeedbackFormProps) {
  const router = useRouter();

  const creationMutation = useMutation({
    mutationFn: async (values) => {
      const feedback = await feedbackCreationAction(
        values as any,
        props.projectID
      );

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
        toast.success("Feedback was add successuff", {
          description: "You will be redirect ",
        });
      }

      setTimeout(() => {
        // window.location.reload();
        router.push(`/p/${props.projectID}/feedbacks`);
      }, 3000);
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

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.loading("Creating...");

    creationMutation.mutateAsync(values as any);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          creationMutation.isPending
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
          Create feedback
        </Button>
      </form>
    </Form>
  );
}
