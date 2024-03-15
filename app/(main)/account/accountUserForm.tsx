"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";

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
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUpload from "@/hooks/useUpload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { accountData, accountUpdateAction } from "./account.action";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  avatar: z.string(),
  firstName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
});

export default function AccountUserForm() {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const [file, setFile] = useState<File>();
  const [filePreview, setFilePreview] = useState("");
  const userEmail = useSession();
  const [userData, setUserData]: any = useState("");

  const updateMutation = useMutation({
    mutationFn: async (values) => {
      return await accountUpdateAction(values as any);
    },
    onSuccess(data) {
      toast.dismiss();
      toast("Save successfull");
      setUserData(data);
    },
  });

  const userDataMutation = useMutation({
    mutationFn: async (email) => {
      return await accountData(email as any);
    },
    onSuccess(data) {
      setUserData(data as any);
      form.reset({
        avatar: "",
        firstName: `${data?.firstName}`,
        lastName: `${data?.lastName}`,
      });
      setFilePreview(`${data?.avatar}`);
    },
  });

  useEffect(() => {
    if (userEmail.data?.user?.email && userDataMutation.isIdle) {
      userDataMutation.mutateAsync(userEmail.data?.user?.email as any);
    }
  }, [userEmail, userDataMutation]);

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

  if (!userDataMutation.isSuccess) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="w-40 h-40 rounded-full" />
        <Skeleton className="w-full h-10 rounded" />
        <Skeleton className="w-full h-10 rounded" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          updateMutation.isPending || onUpload
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
        <Button type="submit" className="w-full">
          Save
        </Button>
      </form>
    </Form>
  );
}
