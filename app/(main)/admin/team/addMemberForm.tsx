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
import { ReactNode, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUpload from "@/hooks/useUpload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { teamCreationAction } from "./create.action";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  email: z.string().email(),
  role: z.string(),
  avatar: z.string(),
  type: z.string(),
  companyName: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
      "Numéro invalide !"
    )
    .optional(),
});

export default function AddMemberForm() {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const [logo, setFile] = useState<File>();
  const [logoPreview, setLogoPreview] = useState("");
  const router = useRouter();

  const creationMutation = useMutation({
    mutationFn: async (values) => {
      const member = await teamCreationAction(values as any);

      if (!member) {
        toast.dismiss();
        toast.error("Process Error", {
          description: "Please wait and retry",
          duration: 10000,
        });
      }

      return member;
    },
    onSuccess(data) {
      if (data) {
        toast.dismiss();
        toast.success("Member was add", {
          description: "A notification will be sent to " + data.firstName,
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
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      avatar: "",
      type: "",
      companyName: "",
      phone: "",
    },
  });

  if (logo) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(logo);
  }

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.loading("Creating...");
    if (logo) {
      const companyLogo = await uploadImage(logo, "company/logo");
      values.avatar = companyLogo as string;
    }
    creationMutation.mutateAsync(values as any);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          creationMutation.isPending || onUpload
            ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
            : "space-y-8"
        }
      >
        <Card className="mt-10 w-1/2">
          <CardContent className="p-6 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Avatar className="w-32 h-32 -mt-16 ml-4 cursor-pointer transition bg-secondary">
                      <AvatarImage src={logoPreview} />
                      <AvatarFallback className="hover:scale-105">
                        AVATAR
                      </AvatarFallback>
                    </Avatar>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      placeholder="Logo"
                      onChange={(e) => setFile(e.target.files?.[0])}
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
        <Card className="mt-4">
          <CardContent className="p-6 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First Name" {...field} />
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
                  <FormControl>
                    <Input placeholder="Last Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardContent className="p-6 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Member is ?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="External">External</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch("type") == "Internal" &&
              (form.setValue("companyName", "") as any)}
            {form.watch("type") == "External" && (
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Member role ?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WORKER">WORKER</SelectItem>
                      <SelectItem value="MANAGER">MANAGER</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="w-full mt-4">
          Create Member
        </Button>
      </form>
    </Form>
  );
}
