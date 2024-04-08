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
import Link from "next/link";
import { signIn } from "next-auth/react";
import { getServerUrl } from "@/lib/server-url";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .email(),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const searchParams = useSearchParams();

  const { mutateAsync, status } = useMutation({
    mutationFn: async (email: string) => {
      await signIn("resend", {
        callbackUrl:
          searchParams.get("callbackUrl") ?? `${getServerUrl()}/admin`,
        redirect: true,
        email,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    // event.preventDefault();
    await mutateAsync(values.email);
  }

  console.log(status);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          status == "pending"
            ? "space-y-8 animate-pulse pointer-events-none"
            : "space-y-8"
        }
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Email</FormLabel>
              <FormControl>
                <Input placeholder="ex: name@work-email.com" {...field} />
              </FormControl>
              <FormDescription>You will recieve a mail</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between w-full">
          <Button type="submit" className="w-full rounded-lg">
            Sign in with email
          </Button>
        </div>
      </form>
    </Form>
  );
}
