"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { format } from "date-fns";

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

import { invoiceCreationAction, invoiceUpdatetAction } from "./invoices.action";
import { Invoice, Project, User } from "@prisma/client";
import Link from "next/link";
import { cn, sanitizeFiles } from "@/lib/utils";
import { useProjectUpload } from "@/hooks/useUpload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  FileUp,
  LucideBadgeCheck,
  LucideUploadCloud,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useSession } from "next-auth/react";
import { sendNewInvoiceNotification } from "@/jobs";
import { getServerUrl } from "@/lib/server-url";
import { getProjectClient } from "../projects/project.action";

const formSchema = z.object({
  reference: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  dueDate: z.date(),
  file: z.string().optional(),
  link: z.string().optional(),
});

export type InvoiceFormProps = {
  projectID: string;
  invoice?: Invoice;
};

export default function InvoiceForm(props: InvoiceFormProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [file, setFile] = useState<File[]>([]);
  const session = useSession();
  const currentUser = session?.data?.user as User;

  const { onUpload, progresspercent, uploadProjectFiles } = useProjectUpload();

  const invoiceMutation = useMutation({
    mutationFn: async (values: Invoice) => {
      if (file.length > 0) {
        const res = await uploadProjectFiles(file, props.projectID, "invoices");
        values.file = res[0];
      }

      if (editMode && props.invoice) {
        return await invoiceUpdatetAction(values, props.invoice.id);
      } else {
        const invoice = await invoiceCreationAction(values, props.projectID);
        if (invoice) {
          // send notification
          const client = await getProjectClient(invoice.project.clientID);
          let emailsClient = client.users.map((client) => client.email);
          await sendNewInvoiceNotification({
            userEmail: emailsClient,
            senderEmail: currentUser?.email,
            senderName: currentUser?.firstName ?? "somme one",
            reference: invoice.project.title,
            link: `${getServerUrl()}/p/${props.projectID}/invoices`,
          });
        }
      }
    },
    onSuccess(data) {
      window.location.reload();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reference: "",
      file: "",
      link: "",
    },
  });

  useMemo(() => {
    if (props.invoice) {
      setEditMode(true);
      form.reset({
        reference: props.invoice.reference,
        dueDate: props.invoice.dueDate,
        file: props.invoice.file ? props.invoice.file : "",
        link: props.invoice.link ? props.invoice.link : "",
      });
    }
  }, [props.invoice, form]);

  const handleFile = (event: React.ChangeEvent<any>) => {
    const maxSize = 5000000;
    const allowedTypes = ["application/pdf"];
    const validFiles = sanitizeFiles(event, maxSize, allowedTypes, 8);
    setFile(validFiles);
  };

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    if (!file.length && !editMode) {
      toast.error("You must entry a document");
      return;
    }

    toast.promise(
      () =>
        new Promise(async (resolve) => {
          const doc = invoiceMutation.mutateAsync(values as any);
          if (doc) {
            resolve(doc);
          }
        }),
      {
        loading: "Performing...",
        success: "Invoice saved",
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
            "px-4 md:px-0",
            invoiceMutation.isPending
              ? "pointer-events-none animate-pulse cursor-wait space-y-8"
              : "space-y-8",
          )}
        >
          <div className="grid grid-cols-12 gap-2">
            <Card className="col-span-4 border-none bg-transparent shadow-none">
              <CardContent className="flex h-full flex-col gap-4 p-0 font-semibold">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="dark:hover:bg-bray-800 flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <FormLabel>
                        {file.length ? (
                          <div className="flex flex-col items-center justify-center p-2 md:p-4">
                            <LucideBadgeCheck className="mb-4 h-8 w-8 text-green-500 dark:text-gray-400" />
                            <p className="mb-2 w-[90%] overflow-hidden text-center text-xs font-semibold text-gray-500 dark:text-gray-400 md:text-sm">
                              {file[0]?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {file[0]?.size / 1000} Ko
                            </p>
                          </div>
                        ) : field.value ? (
                          <div className="flex flex-col items-center justify-center p-2 md:p-4">
                            <LucideBadgeCheck className="mb-4 h-8 w-8 text-green-500 dark:text-gray-400" />
                            <p className="mb-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 md:text-sm">
                              Click to replace
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-2 md:p-4">
                            <LucideUploadCloud className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-center text-xs text-gray-500 dark:text-gray-400 md:text-sm">
                              <span className="font-semibold">
                                Click to upload
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF (5Mo)
                            </p>
                          </div>
                        )}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf"
                          placeholder="Logo"
                          onChange={handleFile}
                          // {...field}
                          className="hidden"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card className="col-span-8 shadow-none">
              <CardContent className="flex flex-col gap-2 p-3 md:gap-4 md:p-6">
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Invoice reference" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="hidden">Due Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full rounded-lg pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Due date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="hidden">Link</FormLabel>
                      <FormControl>
                        <Input placeholder="External link" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
          <Button type="submit" className="w-full">
            {editMode ? "Edit invoice" : "Add invoice"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
