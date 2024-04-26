"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

import { documentUpdatetAction } from "./documents.action";
import { Document } from "@prisma/client";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  link: z.string().url(),
});

export type DocumentFormProps = {
  document: Document;
};

export default function EditDocumentForm(props: DocumentFormProps) {
  const doc = props.document;
  const documentMutation = useMutation({
    mutationFn: async (values: Document) => {
      return await documentUpdatetAction(values, doc.id);
    },
    onSuccess(data) {
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

  useQuery({
    queryKey: ["doc", doc.id],
    queryFn: async () => {
      form.reset({
        title: doc.title,
        link: doc.link as string,
      });
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
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "px-4 sm:px-0",
            documentMutation.isPending
              ? "pointer-events-none animate-pulse cursor-wait space-y-8"
              : "space-y-8",
          )}
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
                      <Input placeholder="https://doc.com/a452da6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          <Button type="submit" className="mt-4 w-full">
            Save document
          </Button>
        </form>
      </Form>
    </div>
  );
}
