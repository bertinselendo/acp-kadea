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
import { Credential } from "@prisma/client";
import {
  credentialUpdatetAction,
  credentialsCreationAction,
} from "./credentials.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  service: z.string(),
  username: z.string(),
  password: z.string(),
  adminUrl: z.string().url(),
});

export type CredentialFormProps = {
  projectID?: string;
  credential?: Credential;
};

export default function CredentialForm(props: CredentialFormProps) {
  const router = useRouter();

  const credentialMutation = useMutation({
    mutationFn: async (values) => {
      if (props.projectID) {
      }

      const credential = props.projectID
        ? await credentialsCreationAction(values as any, props.projectID)
        : props.credential
        ? await credentialUpdatetAction(values as any, props.credential.id)
        : false;

      if (!credential) {
        toast.dismiss();
        toast.error("Process Error", {
          description: "Please wait and retry",
          duration: 10000,
        });
      }

      return credential;
    },
    onSuccess(data) {
      if (data) {
        toast.dismiss();
        toast.success("Action successuff", {
          description: "You will be redirect ",
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      adminUrl: "",
    },
  });

  useEffect(() => {
    if (props.credential) {
      const data = props.credential;
      form.reset({
        username: data.username,
        password: data.password,
        adminUrl: data.adminUrl,
      });
    }
  }, [form, props.credential]);

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.loading("PLease wait...");

    credentialMutation.mutateAsync(values as any);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          credentialMutation.isPending
            ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
            : "space-y-8"
        }
      >
        <div className="flex gap-4 w-full">
          <Card className="mt-4 w-full shadow-none">
            <CardContent className="p-6 flex flex-col gap-4">
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={props.credential?.service}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Service of credential" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Website">Website</SelectItem>
                        <SelectItem value="Hosting">Hosting</SelectItem>
                        <SelectItem value="Domaine registrar">
                          Domaine registrar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Username or Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dashboard url</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://website.com/admin"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <Button type="submit" className="w-full mt-4">
          {props.projectID ? "Add new credential" : "Update details"}
        </Button>
      </form>
    </Form>
  );
}
