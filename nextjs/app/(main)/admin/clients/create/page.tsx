import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth/helper";
import type { PageParams } from "@/types/next";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import CreateClientForm from "./createClientForm";

export default async function CreateClientPage(props: PageParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-11/12 flex-col md:w-6/12 xl:w-5/12">
        <div className="my-4 text-left">
          <h2 className="h2">Create new client</h2>
        </div>
        <div className="mb-20 flex flex-col gap-4">
          <CreateClientForm />
        </div>
      </div>
    </div>
  );
}
