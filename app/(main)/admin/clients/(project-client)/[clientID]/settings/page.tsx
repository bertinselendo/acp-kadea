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
import UpdateClientForm from "./updateClientForm";
import { getClientData } from "./update.action";

export default async function ClientSettingPage(
  props: PageParams<{ clientID: string }>
) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  const client = await getClientData(props.params.clientID);

  if (!client) return;

  return (
    <div className="flex flex-col">
      <div className="my-4 text-left">
        <h2 className="text-2xl font-bold">
          Edit {client?.companyName} project
        </h2>
      </div>
      <div className="flex flex-col gap-4 mb-20">
        <UpdateClientForm clientID={props.params.clientID} client={client} />
      </div>
    </div>
  );
}
