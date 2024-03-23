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
import { IoEllipsisHorizontal, IoTimeOutline } from "react-icons/io5";
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
import { Role } from "@prisma/client";
import Image from "next/image";
import { dicebearAvatar } from "@/lib/auth/auth-utils";

export function TeamListSingleMember(props: any) {
  const { data } = useSession();
  const currentRole = data?.user.role;

  return (
    <div className="flex flex-col gap-4">
      {props.members.map((member: any) => (
        <Card key={member.id} className="w-full flex flex-col p-2 gap-0">
          <CardHeader className="p-2">
            <div className="flex gap-4 justify-between items-start">
              <div className="w-4/5 flex gap-4">
                <Avatar>
                  {member.avatar ? (
                    <AvatarImage src={member.avatar} alt={member.email} />
                  ) : (
                    <Image
                      src={dicebearAvatar(member.email)}
                      alt={member.email}
                      width="40"
                      height="40"
                    />
                  )}
                  <AvatarFallback></AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex gap-2 items-center">
                    <CardTitle className="text-xl capitalize">
                      {member.firstName && member.firstName}{" "}
                      {member.lastName && member.lastName}
                    </CardTitle>
                    <div className="text-sm flex gap-1 items-center">
                      <IoTimeOutline color="#ffd335" />
                      <span>last online</span>
                    </div>
                  </div>
                  <CardDescription>{member.email}</CardDescription>
                </div>
              </div>
              <div className="w-1/5 flex justify-end text-right">
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

                      <DropdownMenuItem>Make a call</DropdownMenuItem>

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
            </div>
          </CardHeader>
          <CardContent className="p-2 pl-16 text-sm">
            <div>
              {member.teamMembers.map((team: any) => (
                <div key={team.id} className="flex gap-2 uppercase">
                  <Badge variant="outline">
                    <Link href={`tel:${team.phone}`}>{team.phone}</Link>
                  </Badge>
                  <Badge variant="outline">{team.type}</Badge>
                  <Badge variant="outline">{member.role}</Badge>
                  {team.companyName && (
                    <Badge variant="outline">{team.companyName}</Badge>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
