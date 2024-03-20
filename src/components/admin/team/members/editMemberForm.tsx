"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AddMemberForm from "../../../../../app/(main)/admin/team/addMemberForm";
import { IoAddCircleOutline, IoCloseOutline } from "react-icons/io5";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { clickAnimation } from "@/components/ui/click-animation";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect } from "react";
import { teamUpdateAction } from "./members.action";

export type EditMemberModalProps = {
  member: any;
};

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  email: z.string().email(),
  role: z.string(),
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

export default function EditMemberModal(props: EditMemberModalProps) {
  const member = props.member;

  const creationMutation = useMutation({
    mutationFn: async (values) => {
      const member = await teamUpdateAction(values as any, props.member.id);

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
        toast.success("Informations saved", {
          description: "You will be redirect... ",
        });
      }

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      type: "",
      companyName: "",
      phone: "",
    },
  });

  useEffect(() => {
    form.reset({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      role: member.role,
      type: member.teamMembers[0]?.type,
      companyName: member.teamMembers[0]?.companyName,
      phone: member.phone,
    });
  }, [form, member]);

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.loading("Creating...");
    creationMutation.mutateAsync(values as any);
  }

  return (
    <Dialog>
      <DialogTrigger
        className={cn(
          navigationMenuTriggerStyle(),
          "w-full flex justify-start p-2"
        )}
        onClick={clickAnimation}
      >
        Edit
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-scroll">
        <DialogHeader>
          <DialogTitle>Edit {member.firstName} informations</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className={
                creationMutation.isPending
                  ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
                  : "space-y-8"
              }
            >
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
                    (form.setValue("companyName", "") as ReactNode)}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
