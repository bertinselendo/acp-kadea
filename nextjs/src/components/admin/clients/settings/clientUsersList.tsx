"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { getClientUsers } from "../clients.action";
import { Client, User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ClientUsersLoop } from "./clientUsersLoop";

export default function ClientUsersList({ client }: { client: Client }) {
  const [users, setUsers] = useState<User[] | null>(null);

  useQuery({
    queryKey: ["clientUsers"],
    queryFn: async () => {
      const users = await getClientUsers(client.id);
      if (users) {
        setUsers(users as any);
        return users;
      }
    },
  });

  if (!users) {
    return (
      <div className="grid grid-cols-1 gap-4 *:animate-pulse md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-6">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="delay-250 h-8 w-[80%]" />
          <Skeleton className="h-6 w-[60%] delay-500" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border p-6">
          <Skeleton className="h-28 w-28 rounded-full" />
          <Skeleton className="delay-250 h-8 w-[80%]" />
          <Skeleton className="h-6 w-[60%] delay-500" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <ClientUsersLoop users={users} client={client} />
    </div>
  );
}
