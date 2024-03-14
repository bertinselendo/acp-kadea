"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUpload from "@/hooks/useUpload";
import { useMutation } from "@tanstack/react-query";
import { newUserUpdateAction } from "./new-user.action";
import { toast } from "sonner";
import { redirect } from "next/navigation";

const formSchema = z.object({
  avatar: z.string(),
  firstName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
});

export default function NewUserForm() {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      await newUserUpdateAction(values as any);
    },
  });
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState("");

  console.log(file);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      firstName: "",
      lastName: "",
    },
  });

  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.loading("Saving...");

    if (file) {
      const avatar = await uploadImage(file, "avatar");
      values.avatar = avatar as string;
    }
    updateMutation.mutateAsync(values as any);
  }

  if (updateMutation.isSuccess) {
    toast.success("Save successfull");
    redirect("/admin");
    updateMutation.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          updateMutation.status == "pending" || onUpload
            ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
            : "space-y-8"
        }
      >
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Avatar className="w-40 h-40 cursor-pointer transition">
                  {/* <p>{filePreview}</p> */}
                  <AvatarImage src={filePreview} />
                  <AvatarFallback className="hover:scale-105">
                    CN
                  </AvatarFallback>
                </Avatar>
              </FormLabel>
              <FormControl>
                <Input
                  type="file"
                  placeholder="file"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  // {...field}
                  className="hidden"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fist name</FormLabel>
              <FormControl>
                <Input placeholder="your firstname" {...field} />
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
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="your lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
