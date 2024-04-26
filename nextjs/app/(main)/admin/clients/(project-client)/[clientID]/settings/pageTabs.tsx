"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UpdateClientForm from "./updateClientForm";
import { Client, User } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ClientUsersList from "@/components/admin/clients/settings/clientUsersList";
import { DeleteClientAlert } from "@/components/admin/clients/settings/deleteClientAlert";

export type PageTabsProps = {
  client: Client;
  user: User;
};

export default function PageTabs({ client, user }) {
  const searchParams = useSearchParams();
  const search = searchParams.get("tb");
  const tb = search ?? "edit";

  return (
    <Suspense>
      <Tabs defaultValue={tb}>
        <TabsList className="w-full flex gap-2 justify-start h-max *:px-6 *:py-3">
          <TabsTrigger value="edit">Edit client</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          {user.role == "MANAGER" ||
            (user.role == "ADMIN" && (
              <TabsTrigger value="delete">
                <span className="text-red-700">Delete client</span>
              </TabsTrigger>
            ))}
        </TabsList>
        <TabsContent value="edit">
          <UpdateClientForm clientID={client.id} client={client} />
        </TabsContent>
        <TabsContent value="users">
          <ClientUsersList client={client} />
        </TabsContent>
        <TabsContent value="delete">
          <DeleteClientAlert client={client} />
        </TabsContent>
      </Tabs>
    </Suspense>
  );
}
