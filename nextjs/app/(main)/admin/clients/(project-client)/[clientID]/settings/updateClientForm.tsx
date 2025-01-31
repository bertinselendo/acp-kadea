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
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUpload from "@/hooks/useUpload";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { clientUpdateAction } from "./update.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useParams, useRouter } from "next/navigation";
import { countryList, getRandomColor } from "@/lib/utils";

const formSchema = z.object({
  companyName: z.string().min(2, {
    message: "Must be at least 2 characters.",
  }),
  companyEmail: z.string().email(),
  companyPhone: z
    .string()
    .regex(
      /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
      "Numéro invalide !",
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
  internalNote: z.any(),
});

export default function UpdateClientForm({ clientID, client }: any) {
  const { onUpload, progresspercent, uploadImage } = useUpload();
  const [logo, setFile] = useState<File>();
  const [logoPreview, setLogoPreview] = useState<string | null>();
  const [currentData, setCurrentData] = useState({
    companyName: client.companyName,
    companyEmail: client.companyEmail,
    companyPhone: client.phone,
    companyAdress: client.address,
    companyCountry: client.country,
    companyLogo: client.logo,
    companyCategorie: client.categorie,
    companySize: client.size,
    companyWebsite: client.website,
    internalNote: client.internalNote,
  });
  const [generatedColor, setGeneratedColor] =
    useState<string>(getRandomColor());
  const router = useRouter();

  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const update = await clientUpdateAction(values as any, clientID);
      if (update) {
        return update;
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
        setTimeout(() => {
          window.location.reload();
        }, 1000);
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
      internalNote: "",
    },
  });

  useEffect(() => {
    form.reset(currentData);
    setLogoPreview(client.logo);
  }, [form, currentData, client.logo]);

  if (logo) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(logo);
  }

  async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
    event.preventDefault();

    if (
      JSON.stringify(currentData) === JSON.stringify(values) &&
      client.logo == logoPreview
    ) {
      toast("You made no changes");
      return;
    }

    toast.promise(
      new Promise(async (resolve) => {
        if (logo) {
          const companyLogo = await uploadImage(logo, "company/logo");
          values.companyLogo = companyLogo as string;
        }

        const client = await updateMutation.mutateAsync(values as any);
        if (client) {
          resolve(client);
          return client;
        }
      }),
      {
        loading: "Updating...",
        success: "Update succesfull<br>You will be redirect",
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
        className={
          updateMutation.isPending || onUpload
            ? "pointer-events-none animate-pulse cursor-wait space-y-8"
            : "space-y-8"
        }
      >
        <Card>
          <CardContent className="flex flex-col gap-4 p-6">
            <div
              className="relative h-20 w-full rounded md:h-32"
              style={{
                background: `${generatedColor}`,
              }}
            >
              <div
                className="absolute bottom-2 right-2 cursor-pointer rounded-lg bg-secondary p-2 text-xs shadow-sm hover:bg-secondary hover:opacity-90"
                onClick={() => setGeneratedColor(getRandomColor())}
              >
                Generate color
              </div>
            </div>
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    <Avatar className="-mt-16 ml-4 h-28 w-28 cursor-pointer bg-secondary transition md:h-32 md:w-32">
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
          <CardContent className="flex flex-col gap-4 p-6">
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
                    defaultValue={client.country}
                  >
                    <FormControl>
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
            <FormField
              control={form.control}
              name="companyCategorie"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={client.categorie}
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
                    defaultValue={client.size}
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
          <CardContent className="flex flex-col gap-4 p-6">
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
        <Button type="submit" className="mt-4 w-full">
          Update
        </Button>
      </form>
    </Form>
  );
}
