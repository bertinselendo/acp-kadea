"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
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
import { Calendar as CalendarIcon, XCircleIcon } from "lucide-react";
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
  getProjectClient,
  getProjectTeamMembers,
  projectCreationAction,
} from "./project.action";
import { getTeamMembers } from "../team/members/members.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader } from "@/components/ui/loader";
import { useSession } from "next-auth/react";
import { Project, User } from "@prisma/client";
import { getServerUrl } from "@/lib/server-url";
import {
  sendProjectCreationClientNotification,
  sendProjectCreationTeamNotification,
} from "@/jobs";

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
  tags: z.string(),
  teamMembers: z.any(),
});

function memberAvatar(member: any) {
  return (
    <Avatar className="max-w-6 max-h-6">
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

export type AddProjectModalProps = {
  clientID: string;
};

export default function AddProjectForm(props: AddProjectModalProps) {
  const [cover, setCover] = useState("");
  const [tags, setTags] = useState([] as string[]);
  const [members, setMembers] = useState<MemberTypes[]>([]);
  const [sMembers, setSMembers] = useState<MemberTypes[]>([]);
  const router = useRouter();
  const session = useSession();
  const currentUser = session?.data?.user as User;

  useEffect(() => {
    const fetchData = async () => {
      const members = await getTeamMembers();
      if (members) {
        setMembers(members as any);
      }
    };
    fetchData();
  }, []);

  const creationMutation = useMutation({
    mutationFn: async (values) => {
      const project = await projectCreationAction(
        values as any,
        props.clientID,
        sMembers as any
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
    onSuccess: async (data: Project) => {
      if (data) {
        // send email to client users
        const client = await getProjectClient(data.clientID);
        let emailsClient = client.users.map((client) => client.email);
        await sendProjectCreationClientNotification({
          userEmail: emailsClient,
          senderEmail: currentUser?.email,
          senderName: currentUser?.firstName ?? "somme one",
          reference: data.title,
          reference2: client.companyName,
          link: `${getServerUrl()}/p/${data?.id}`,
        });

        // send email to team members
        const teams = await getProjectTeamMembers(data.clientID);
        let emailsTeam = teams.map((team) => team.email);
        await sendProjectCreationTeamNotification({
          userEmail: emailsTeam,
          senderEmail: currentUser?.email,
          senderName: currentUser?.firstName ?? "somme one",
          reference: data.title,
          link: `${getServerUrl()}/p/${data?.id}`,
        });

        setTimeout(() => {
          window.location.reload();
          // router.push(`/p/${data?.id}`);
        }, 1000);
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      cover: getRandomColor(),
      priority: "Normal",
      status: "To do",
      tags: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    toast.promise(
      new Promise(async (resolve) => {
        values.tags = tags.join(",");

        const project = creationMutation.mutateAsync(values as any);
        if (project) {
          resolve(project);
          return project;
        }
      }),
      {
        loading: "Creating...",
        success: "Setup succesfull<br>You will be redirect",
        error: (error) => {
          return error;
        },
      }
    );
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          creationMutation.isPending
            ? "space-y-8 animate-pulse cursor-wait pointer-events-none"
            : "space-y-8"
        }
      >
        <div className="flex gap-4 w-full">
          <Card className="mt-4 lg:w-7/12 shadow-none">
            <CardContent className="p-6 flex flex-col gap-4">
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
              <div className="flex w-full gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
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
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
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
          <Card className="mt-4 lg:w-5/12 shadow-none">
            <CardContent className="p-6 flex flex-col gap-4">
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
                          <SelectValue placeholder="Select priority" />
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
                        onKeyDown={(event: any) => {
                          if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            form.setValue("tags", "");
                            addBadge(event.target.value.trim(), "tags");
                          }
                        }}
                      />
                    </FormControl>
                    <div className="flex flex-wrap gap-2 transition">
                      {tags.map((tag, index) => (
                        <Badge key={index} className="capitalize text-sm">
                          {tag}
                          <XCircleIcon
                            size="14"
                            onClick={() => removeBadge(index, "tags")}
                            className="hover:cursor-pointer ml-1"
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
                          className="capitalize text-sm w-max bg-light-blue"
                        >
                          <div className="flex gap-1 items-center">
                            {memberAvatar(sMember)} {sMember.firstName}{" "}
                            {sMember.lastName}
                          </div>
                          <XCircleIcon
                            size="14"
                            onClick={() => removeBadge(index, "sMembers")}
                            className="hover:cursor-pointer ml-1"
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
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? members.find(
                                  (member) =>
                                    `${member.firstName} ${member.lastName}` ===
                                    field.value
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
                              <div className="h-10 w-full p-2 flex justify-center items-center">
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
        <Button type="submit" className="w-full mt-4">
          Create Project
        </Button>
      </form>
    </Form>
  );
}
