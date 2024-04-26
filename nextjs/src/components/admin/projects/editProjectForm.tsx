"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, Loader2, XCircleIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn, getRandomColor } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  getClientSingleProject,
  projectRemoveTeamMemberAction,
  projectUpdateAction,
} from "./project.action";
import { getTeamMembers } from "../team/members/members.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { Project, TeamMember } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  cover: z.string(),
  priority: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.string(),
  tags: z.string().optional(),
  teamMembers: z.any(),
});

function memberAvatar(member: any) {
  return (
    <Avatar className="max-h-6 max-w-6">
      <AvatarImage
        src={member.avatar}
        alt={`${member.firstName} ${member.lastName}`}
      />
      <AvatarFallback className="bg-gray-700"></AvatarFallback>
    </Avatar>
  );
}

type MemberTypes = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type AddProjectModalProps = {};

export default function EditProjectForm(props: AddProjectModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [members, setMembers] = useState<MemberTypes[]>([]);
  const [sMembers, setSMembers] = useState<MemberTypes[]>([]);
  const router = useRouter();
  const { projectID } = useParams();

  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const project = await projectUpdateAction(
        values as any,
        projectID as string,
        sMembers,
      );

      if (!project) {
        toast.dismiss();
        toast.error("Process Error", {
          description: "Please wait and retry",
          duration: 10000,
        });
      }

      return project;
    },
    onSuccess(data) {
      if (data) {
        toast.dismiss();
        toast.success("Project was updated", {
          description: "You will be redirect ",
        });
      }

      setTimeout(() => {
        window.location.reload();
        // router.push(`/p/${data?.id}`);
      }, 1000);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      cover: getRandomColor(),
      priority: "Normal",
      status: "To Do",
    },
  });

  const projectData = useQuery({
    queryKey: ["project", projectID],
    queryFn: async () => {
      const members = await getTeamMembers();
      if (members) {
        setMembers(members as any);
        const data = await getClientSingleProject(projectID as string);
        if (data) {
          form.reset({
            title: data.title,
            description: data.description as string,
            cover: data.cover as string,
            priority: data.priority as string,
            startDate: data.startDate as Date,
            endDate: data.endDate as Date,
            status: data.status as string,
          });

          const tags = data.tags?.split(",");
          setTags(tags as string[]);

          const teamArray: any = [];
          data.teamMembers.map((team) => {
            const sme = members.find((member) => member.id == team.userId);
            if (sme) teamArray.push(sme);
            setSMembers(teamArray);
          });

          return data;
        }
      }

      toast.error("Error unknown");
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.loading("Creating...");
    values.tags = tags.join(",");

    updateMutation.mutateAsync(values as any);
  }

  const addBadge = (tag: any, where: any) => {
    if (tag && !eval(where).includes(tag)) {
      const newTags = [...eval(where), tag];
      if (where == "tags") {
        setTags(newTags);
      } else if (where == "sMembers") {
        setSMembers(newTags as any);
      }
    }
    if (eval(where).includes(tag)) {
      toast.error("Already add");
    }
  };

  const removeBadge = (index: number, where: string) => {
    const newTags = [...eval(where)];
    newTags.splice(index, 1);
    if (where == "tags") {
      setTags(newTags);
    } else if (where == "sMembers") {
      setSMembers(newTags as any);
    }
  };

  const removeTeamMember = async (index: number, sMember: any) => {
    const newTags = sMembers;
    newTags.splice(index, 1);
    setSMembers(newTags as any);
    const member = await projectRemoveTeamMemberAction(
      projectID as string,
      sMember,
    );
    if (member) {
      toast.success("User removed form this project");
    }
  };

  if (projectData.isPending) {
    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2 *:w-full">
          <Skeleton className="h-40" />
          <Skeleton className="h-20" />
        </div>
        <div className="flex flex-col gap-2 *:w-full">
          <Skeleton className="h-20" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "px-4 md:px-0",
          updateMutation.isPending
            ? "pointer-events-none animate-pulse cursor-wait space-y-8"
            : "space-y-8",
        )}
      >
        <div className="flex h-[60vh] w-full flex-col gap-2 overflow-y-scroll md:flex-row md:gap-4">
          <Card className="mt-0 shadow-none md:mt-4 lg:w-7/12">
            <CardContent className="flex flex-col gap-4 p-4 md:p-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Project title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Short project description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex w-full gap-1 md:gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
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
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="mt-0 h-max shadow-none md:mt-4 lg:w-5/12">
            <CardContent className="flex flex-col gap-4 p-4 md:p-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="To Do" className="text-[#3eaeff]">
                          To Do
                        </SelectItem>
                        <SelectItem
                          value="In Progress"
                          className="text-[#ffa540]"
                        >
                          In Progress
                        </SelectItem>
                        <SelectItem value="Done" className="text-[#2db976]">
                          Done
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Low" className="text-[#3eaeff]">
                          Low
                        </SelectItem>
                        <SelectItem value="Normal" className="text-[#ffa540]">
                          Normal
                        </SelectItem>
                        <SelectItem value="High" className="text-[#ff4444]">
                          High
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tags"
                        {...field}
                        value={field.value || ""}
                        onKeyDown={(event: any) => {
                          if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            addBadge(event.target.value.trim(), "tags");
                            form.setValue("tags", "");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2 transition">
                      {tags.map((tag, index) => (
                        <Badge key={index} className="text-sm capitalize">
                          {tag}
                          <XCircleIcon
                            size="14"
                            onClick={() => removeBadge(index, "tags")}
                            className="ml-1 hover:cursor-pointer"
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamMembers"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Team mebers</FormLabel>
                    <div className="flex flex-wrap gap-2 transition">
                      {sMembers.map((sMember, index) => (
                        <Badge
                          key={index}
                          className="w-max bg-light-blue text-sm capitalize"
                        >
                          <div className="flex items-center gap-1">
                            {memberAvatar(sMember)} {sMember.firstName}{" "}
                            {sMember.lastName}
                          </div>
                          <XCircleIcon
                            size="14"
                            onClick={() => removeTeamMember(index, sMember)}
                            className="ml-1 hover:cursor-pointer"
                          />
                        </Badge>
                      ))}
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value
                              ? members.find(
                                  (member) =>
                                    `${member.firstName} ${member.lastName}` ===
                                    field.value,
                                )?.firstName
                              : "Select a team member"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search team members..." />
                          <CommandList>
                            {!members.length ? (
                              <div className="flex h-10 w-full items-center justify-center p-2">
                                <Loader />
                              </div>
                            ) : (
                              <CommandEmpty>No member found.</CommandEmpty>
                            )}
                            <CommandGroup>
                              {members.map((member) => (
                                <CommandItem
                                  value={`${member.firstName} ${member.lastName}`}
                                  key={member.id}
                                  onSelect={() => {
                                    form.setValue("teamMembers", "");
                                    addBadge(member, "sMembers");
                                  }}
                                  className="flex gap-2 data-[disabled]:pointer-events-auto data-[disabled]:opacity-100"
                                >
                                  {memberAvatar(member)}
                                  {`${member.firstName} ${member.lastName}`}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>
        <Button type="submit" className="mt-4 w-full">
          Update Project
        </Button>
      </form>
    </Form>
  );
}
