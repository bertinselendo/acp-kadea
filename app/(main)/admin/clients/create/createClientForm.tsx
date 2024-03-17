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
import { Card, CardContent } from "@/components/ui/card";
import {
  clientCreationAction,
  isClientData,
  userCreationAction,
} from "./create.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  companyEmail: z.string().email(),
  companyPhone: z
    .string()
    .regex(
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
      "Numéro invalide !"
    ),
  companyAdress: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  companyCountry: z.string().min(1, {
    message: "Requied.",
  }),
  companyLogo: z.string(),
  companyCategorie: z.string().min(1, {
    message: "Requied.",
  }),
  companySize: z.string().min(1, {
    message: "Requied.",
  }),
  companyWebsite: z.string().url(),
  contactFistName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  contactEmail: z.string().email(),
  internalNote: z.any(),
});

const randomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default function CreateClientForm() {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const [logo, setFile] = useState<File>();
  const [logoPreview, setLogoPreview] = useState("");
  const router = useRouter();
  const [generatedColor, setgeneratedColor] = useState(randomColor());

  const creationMutation = useMutation({
    mutationFn: async (values) => {
      // add user first
      const user = await userCreationAction(values as any);
      if (user) {
        toast.loading("Setup project...");
        // then add client
        const client = await clientCreationAction(values as any, user.id);
        return client;
      }

      // error if nothing perform
      toast.dismiss();
      toast.error("Process Error", {
        description: "Please wait and retry",
        duration: 10000,
      });
    },
    onSuccess(data) {
      if (data) {
        console.log(data);

        toast.dismiss();
        toast.success("Setup succesfull", {
          description: "contact email will recieve email to access resources",
          action: {
            label: "Go to client",
            onClick() {
              router.push(`/admin/clients/${data.id}`);
            },
          },
        });
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyEmail: "",
      companyPhone: "",
      companyAdress: "",
      companyCountry: "",
      companyLogo: "",
      companyCategorie: "",
      companySize: "",
      companyWebsite: "",
      contactFistName: "",
      contactEmail: "",
      internalNote: "",
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

    // check if client already exist
    toast.loading("Checking...");
    const clientData = await isClientData(values);
    if (clientData) {
      toast.dismiss();
      toast.error("Client already exist");
      return;
    }

    toast.loading("Creating...");
    if (logo) {
      const companyLogo = await uploadImage(logo, "company/logo");
      values.companyLogo = companyLogo as string;
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
        <Card>
          <CardContent className="p-6 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <div
                      className="w-full h-40 rounded relative"
                      style={{ background: generatedColor }}
                      onClick={() => setgeneratedColor(randomColor())}
                    >
                      <Button
                        size="sm"
                        className="p-2 text-xs bg-secondary hover:bg-secondary hover:opacity-90 absolute bottom-2 right-2"
                      >
                        Generate color
                      </Button>
                    </div>
                    <Avatar className="w-32 h-32 -mt-16 ml-4 cursor-pointer transition bg-secondary">
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
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Entreprise</h3>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyEmail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyPhone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyAdress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Adress" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyCountry"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="belgique">Belgique</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="other">other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyCategorie"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a categorie" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="local_business">
                        Local Business or Place
                      </SelectItem>
                      <SelectItem value="company">
                        Company, Organization, or Institution
                      </SelectItem>
                      <SelectItem value="brand">Brand or Product</SelectItem>
                      <SelectItem value="public_figure">
                        Artist, Band, or Public Figure
                      </SelectItem>
                      <SelectItem value="entertainment">
                        Entertainment
                      </SelectItem>
                      <SelectItem value="community">
                        Cause or Community
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companySize"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1_5">1-5 employees</SelectItem>
                      <SelectItem value="5_15">5-15 employees</SelectItem>
                      <SelectItem value="15_plus">15+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="companyWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardContent className="p-6 flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Contact</h3>
            <FormField
              control={form.control}
              name="contactFistName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="First name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactEmail"
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
              name="internalNote"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea placeholder="Internal note" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Button type="submit" className="w-full mt-4">
          Create client
        </Button>
      </form>
    </Form>
  );
}
