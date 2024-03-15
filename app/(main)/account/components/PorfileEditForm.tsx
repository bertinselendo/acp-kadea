"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SkeletonCard } from "@/components/skeleton/SkeletonCard";
import { toast } from "sonner";
import { updateEditForm } from "../account.action";

const formSchema = z.object({
  name: z.string().min(2).max(12),
});

export default function PorfileEditForm() {
  const { status, data } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userEmail = data?.user?.email;
    if (userEmail) {
      const updateUser = await updateEditForm({ userEmail, values });
      toast.loading("Posting...");
      if (updateUser) {
        toast.success("Data updated");
      }
    } else {
      toast.error("error while finding user");
    }

    console.log(values);
  }

  if (status == "loading") {
    return <SkeletonCard />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
