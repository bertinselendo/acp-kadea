"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export type clientUsersProps = [
  {
    id: string;
    firstName: string;
  }
];

export default function ListClientUsers(props: {
  users: clientUsersProps | undefined;
}) {
  const users = props.users;

  if (!users) {
    return (
      <div className="flex gap-2">
        <Skeleton className="w-20 h-6 rounded-full" />
        <Skeleton className="w-20 h-6 rounded-full opacity-80" />
      </div>
    );
  }

  return (
    <div>
      <ul className="flex gap-2">
        {users.map((user) => (
          <li key={user.id}>
            <Badge variant="outline" className="bg-background">
              {user.firstName}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
