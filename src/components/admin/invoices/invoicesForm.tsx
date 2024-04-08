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
import { Invoice } from "@prisma/client";
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
        return await invoiceCreationAction(values, props.projectID);
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
      }
    );
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={
            invoiceMutation.isPending
              ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
              : "space-y-8"
          }
        >
          <div className="grid grid-cols-12 gap-2">
            <Card className="shadow-none border-none bg-transparent col-span-4">
              <CardContent className="p-0 flex flex-col gap-4 font-semibold h-full">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <FormLabel>
                        {file.length ? (
                          <div className="flex flex-col items-center justify-center p-4">
                            <LucideBadgeCheck className="w-8 h-8 mb-4 text-green-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm w-[90%] overflow-hidden text-center font-semibold text-gray-500 dark:text-gray-400">
                              {file[0]?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {file[0]?.size / 1000} Ko
                            </p>
                          </div>
                        ) : field.value ? (
                          <div className="flex flex-col items-center justify-center p-4">
                            <LucideBadgeCheck className="w-8 h-8 mb-4 text-green-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-center font-semibold text-gray-500 dark:text-gray-400">
                              Click to replace
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-4">
                            <LucideUploadCloud className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" />
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
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
            <Card className="shadow-none col-span-8">
              <CardContent className="p-6 flex flex-col gap-4">
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
                                "w-full pl-3 text-left font-normal rounded-lg",
                                !field.value && "text-muted-foreground"
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
