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
    <div className="grid grid-cols-2 gap-4">
      {users.map((user) => (
        <Card
          key={user.id}
          className="w-full flex flex-col justify-center p-0 gap-1 relative"
        >
          <CardHeader className="justify-center items-center">
            <div className="absolute top-2 right-4">
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
            <Avatar className="w-28 h-28">
              <AvatarImage src={user.avatar} alt={user.email} />
              <AvatarFallback>
                <UserDiceAvater email={user.email} />
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="text-sm text-center">
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
        className="w-full flex flex-col justify-center p-2 gap-0 relative"
      >
        <CardContent className="text-sm text-center min-h-32 p-0 flex justify-center items-center">
          <AddClientUserModal client={client} />
        </CardContent>
      </Card>
    </div>
  );
}
