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
import { redirect, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOnboardUser } from "./onboarding.action";
import { User } from "@prisma/client";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Must be at least 2 characters.",
    })
    .email(),
  firstName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
});

export function OnboardUserStepForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const { mutateAsync, status } = useMutation({
    mutationFn: async (values: any) => {
      const resend = await signIn("resend", {
        callbackUrl: `${getServerUrl()}/auth/onboarding?step=organization`,
        redirect: false,
        email: values.email,
      });

      if (resend.error) {
        toast.error("Error unknow: Please wait and try again");
      } else {
        const user = await createOnboardUser(values);
        if (user) {
          window.location.assign("/auth/onboarding?step=verify");
        }
      }
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await mutateAsync(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          status == "pending"
            ? "space-y-4 animate-pulse pointer-events-none"
            : "space-y-4"
        }
      >
        <div className="grid grid-cols-2 gap-4 w-full">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="hidden">First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="First name"
                    className="bg-transparent"
                    {...field}
                  />
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
                <FormLabel className="hidden">Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Last name"
                    className="bg-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="hidden">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: name@work-email.com"
                  className="bg-transparent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end w-full">
          <Button type="submit" className="w-3/5 rounded-lg">
            Next step
          </Button>
        </div>
      </form>
    </Form>
  );
}
