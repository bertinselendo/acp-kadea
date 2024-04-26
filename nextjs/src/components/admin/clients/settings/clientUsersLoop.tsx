"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { IoEllipse, IoEllipsisHorizontal } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clickAnimation } from "@/components/ui/click-animation";
import { useSession } from "next-auth/react";
import { Client, User } from "@prisma/client";
import Image from "next/image";
import { dicebearAvatar } from "@/lib/auth/auth-utils";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import AddClientUserModal from "./addClientUserModal";
import { DeleteClientUserAlert } from "./deleteClientUserAlert";

export function ClientUsersLoop({
  users,
  client,
}: {
  users: User[];
  client: Client;
}) {
  const { data } = useSession();
  const user = data?.user as User;
  const currentRole = user?.role;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {users.map((user) => (
        <Card
          key={user.id}
          className="relative flex w-full flex-col justify-center gap-1 p-0"
        >
          <CardHeader className="items-center justify-center">
            <div className="absolute right-4 top-2">
              {user.id != data?.user.id ? (
                <div>
                  {users.length > 1 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="focus:hidden">
                        <IoEllipsisHorizontal onClick={clickAnimation} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {/* {(currentRole == "ADMIN" || currentRole == "MANAGER") && (
                      <DeleteClientUserAlert user={user} />
                    )} */}
                        <DeleteClientUserAlert user={user} />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ) : (
                <Badge>Me</Badge>
              )}
            </div>
            <Avatar className="h-24 w-24 md:h-28 md:w-28">
              <AvatarImage src={user.avatar} alt={user.email} />
              <AvatarFallback>
                <UserDiceAvater email={user.email} />
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="text-center text-sm">
            <CardTitle className="text-xl capitalize">
              {user.firstName && user.firstName}{" "}
              {user.lastName && user.lastName}
            </CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardContent>
        </Card>
      ))}
      <Card
        key={user.id}
        className="relative flex w-full flex-col justify-center gap-0 p-2"
      >
        <CardContent className="flex min-h-32 items-center justify-center p-0 text-center text-sm">
          <AddClientUserModal client={client} />
        </CardContent>
      </Card>
    </div>
  );
}
