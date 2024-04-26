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
import EditMemberModal from "./editMemberForm";
import { DeleteMemberAlert } from "./deleteMemberAlert";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import Image from "next/image";
import { dicebearAvatar } from "@/lib/auth/auth-utils";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";

export function TeamListSingleMember(props: any) {
  const { data } = useSession();
  const user = data?.user as User;
  const currentRole = user?.role;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-1 xl:grid-cols-2">
      {props.members.map((member: any) => (
        <Card
          key={member.id}
          className="relative flex w-full flex-col justify-center gap-1 p-0"
        >
          <CardHeader className="items-center justify-center">
            <div className="absolute right-4 top-2">
              {member.id != data?.user.id ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:hidden">
                    <IoEllipsisHorizontal onClick={clickAnimation} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* <DropdownMenuLabel>Filter by</DropdownMenuLabel> */}
                    {(currentRole == "ADMIN" || currentRole == "MANAGER") && (
                      <EditMemberModal member={member} />
                    )}

                    <DropdownMenuItem>
                      <Link href={`tel:${member.teamMembers?.phone}`}>
                        Make a call
                      </Link>
                    </DropdownMenuItem>

                    {currentRole == "ADMIN" && (
                      <>
                        <DropdownMenuSeparator />
                        <DeleteMemberAlert member={member} />
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Badge>Me</Badge>
              )}
            </div>
            <Avatar className="h-24 w-24 md:h-28 md:w-28">
              <AvatarImage src={member.avatar} alt={member.email} />
              <AvatarFallback>
                <UserDiceAvater email={member.email} />
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="text-center text-sm">
            <CardTitle className="text-xl capitalize">
              {member.firstName && member.firstName}{" "}
              {member.lastName && member.lastName}
            </CardTitle>
            <CardDescription>{member.email}</CardDescription>
            {member.teamMembers && (
              <div
                key={member.teamMembers?.id}
                className="my-2 flex flex-wrap justify-center gap-2 uppercase"
              >
                <Badge variant="outline" className="border-none bg-light-blue">
                  <Link href={`tel:${member.teamMembers?.phone}`}>
                    {member.teamMembers?.phone}
                  </Link>
                </Badge>
                <Badge variant="outline" className="border-none bg-light-red">
                  {member.teamMembers?.type}
                </Badge>
                <Badge variant="outline" className="border-none bg-light-green">
                  {member.role}
                </Badge>
                {member.teamMembers?.companyName && (
                  <Badge variant="outline">
                    {member.teamMembers?.companyName}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
