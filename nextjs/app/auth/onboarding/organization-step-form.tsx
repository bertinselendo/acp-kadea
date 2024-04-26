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
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUpload from "@/hooks/useUpload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryList, getRandomColor } from "@/lib/utils";
import { sendClientCreationNotification } from "@/jobs";
import { useSession } from "next-auth/react";
import { Client, User } from "@prisma/client";
import { getServerUrl } from "@/lib/server-url";
import {
  createOnboardOrganization,
  isOrganizationExist,
} from "./onboarding.action";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Must be at least 2 characters",
  }),
  email: z.string().email(),
  phone: z
    .string()
    .regex(
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
      "Invalid number"
    ),
  address: z.string().min(2, {
    message: "Must be at least 2 characters",
  }),
  city: z.string().min(2, {
    message: "Must be at least 2 characters",
  }),
  country: z.string(),
  logo: z.string(),
  cover: z.string(),
  website: z
    .string()
    .regex(
      /^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-zA-Z0-9-]+(\.[a-z]{2,})+(?:\/[\w-]*)*$/,
      "Invalide url"
    ),
});

export default function OnboardOrganizationStepForm() {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const [logo, setFile] = useState<File>();
  const [logoPreview, setLogoPreview] = useState("");
  const [generatedColor, setGeneratedColor] = useState(getRandomColor());
  const session = useSession();
  const currentUser = session?.data?.user as User;

  const creationMutation = useMutation({
    mutationFn: async (values: any) => {
      const organization = await createOnboardOrganization(values);

      if (organization) {
        return organization;
      }
      // error if nothing perform
      toast.dismiss();
      toast.error("Process Error", {
        description: "Please wait and retry",
        duration: 10000,
      });
    },
    onSuccess: async (data: Client & { user: User }) => {
      if (data) {
        // await sendClientCreationNotification({
        //   userEmail: [data.user.email] ?? [""],
        //   senderEmail: currentUser?.email,
        //   senderName: currentUser?.firstName ?? "somme one",
        //   reference: data.companyName,
        //   link: `${getServerUrl()}/admin/clients/${data.id}`,
        // });
        window.location.assign("/auth/onboarding?step=subscription");
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      logo: "",
      cover: "",
      website: "",
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
    // check if organization already exist
    const isOrganization = await isOrganizationExist(values as any);
    if (isOrganization) {
      toast.dismiss();
      toast.error("Organization already exist");
      return;
    }

    toast.promise(
      new Promise(async (resolve) => {
        if (logo) {
          const logoUrl = await uploadImage(logo, "organization/logo");
          values.logo = logoUrl as string;
        }
        values.cover = generatedColor;
        const organization = await creationMutation.mutateAsync(values as any);
        if (organization) {
          resolve(organization);
          return organization;
        }
      }),
      {
        loading: "Creating...",
        success: "Organization created",
        error: (error) => {
          return error;
        },
      }
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={
          creationMutation.isPending || onUpload
            ? "space-y-4 animate-pulse cursor-wait pointer-events-none"
            : "space-y-4"
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Company name"
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Website"
                    className="bg-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Company email"
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Company phone"
                    className="bg-transparent"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <Avatar className="w-20 h-20 cursor-pointer transition bg-secondary border">
                    <AvatarImage src={logoPreview} />
                    <AvatarFallback className="hover:scale-105">
                      LOGO
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
          <div
            className="w-full h-20 rounded relative"
            style={{
              background: `${generatedColor}`,
            }}
          >
            <div
              className="p-2 text-xs bg-secondary rounded-lg shadow-sm cursor-pointer hover:bg-secondary hover:opacity-90 absolute bottom-2 right-2"
              onClick={() => setGeneratedColor(getRandomColor())}
            >
              Generate color
            </div>
          </div>
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Adress"
                  className="bg-transparent"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="City"
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
            name="country"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="bg-transparent">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {countryList().map((country, index) => (
                      <SelectItem key={index} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end w-full">
          <Button type="submit" className="w-3/5 rounded-lg">
            Next step
          </Button>
        </div>
      </form>
    </Form>
  );
}
