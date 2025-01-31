"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { useState } from "react";
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
import { teamCreationAction } from "./create.action";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import { sendTeamCreationNotification } from "@/jobs/team/creation";
import { getServerUrl } from "@/lib/server-url";
import { cn } from "@/lib/utils";

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
      "Numéro invalide !",
    )
    .optional(),
});

export default function AddMemberForm() {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const [logo, setFile] = useState<File>();
  const [logoPreview, setLogoPreview] = useState("");
  const session = useSession();
  const currentUser = session?.data?.user as User;

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
    onSuccess: async (data: User) => {
      if (data) {
        await sendTeamCreationNotification({
          userEmail: [data.email],
          senderEmail: currentUser?.email,
          senderName: currentUser?.firstName ?? "somme one",
          reference: "Team Member",
          link: `${getServerUrl()}/admin`,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
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

    toast.promise(
      new Promise(async (resolve) => {
        if (logo) {
          if (logo) {
            const companyLogo = await uploadImage(logo, "company/logo");
            values.avatar = companyLogo as string;
          }
        }
        const creation = creationMutation.mutateAsync(values as any);
        if (creation) {
          resolve(creation);
          return creation;
        }
      }),
      {
        loading: "Creating...",
        success:
          "Setup succesfull<br>Team will recieve email to access resources",
        error: (error) => {
          return error;
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "px-4 md:px-0",
          creationMutation.isPending || onUpload
            ? "pointer-events-none animate-pulse cursor-wait space-y-8"
            : "space-y-8",
        )}
      >
        <div className="custom-sroll h-[50vh] overflow-y-scroll p-1">
          <Card className="mt-10 w-full md:w-1/2">
            <CardContent className="flex flex-col gap-4 p-6">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Avatar className="-mt-16 ml-4 h-28 w-28 cursor-pointer bg-secondary transition md:h-32 md:w-32">
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
            <CardContent className="flex flex-col gap-4 p-6">
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
            <CardContent className="flex flex-col gap-4 p-6">
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
        </div>
        <Button type="submit" className="mt-4 w-full">
          Create Member
        </Button>
      </form>
    </Form>
  );
}
