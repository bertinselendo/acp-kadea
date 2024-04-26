"use client";

import { clickAnimation } from "@/components/ui/click-animation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { parseDate, relativeDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Document, User } from "@prisma/client";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IoDocumentAttach,
  IoDocumentText,
  IoEllipsisHorizontal,
  IoEllipsisVertical,
} from "react-icons/io5";
import { useSession } from "next-auth/react";
import EditMemberModal from "../team/members/editMemberForm";
import { DeleteMemberAlert } from "../team/members/deleteMemberAlert";
import { DeleteDocumentAlert } from "./deleteDocumentAlert";
import DeleteDocumentModal from "./editDocumentModal";
import EditDocumentModal from "./editDocumentModal";
import { usePathname } from "next/navigation";

export type ListDocumentsLoopProps = {
  documents: [
    Document & {
      user: User;
    },
  ];
};

export default function ListDocumentsLoop(props: ListDocumentsLoopProps) {
  const documents = props.documents;
  const pathname = usePathname();

  const { data } = useSession();
  const user = data?.user as User;
  const currentRole = user?.role;

  if (!documents) {
    return (
      <li className="flex w-full animate-pulse flex-col gap-4 rounded-lg border bg-transparent p-4 md:w-[49%]">
        <Skeleton className="delay-250 h-40 w-full" />
        <div className="flex gap-10">
          <Skeleton className="h-10 w-2/3 delay-500" />
          <Skeleton className="delay-750 h-10 w-1/3" />
        </div>
      </li>
    );
  }

  if (!documents.length) {
    return (
      <li className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border bg-transparent p-8 text-center text-sm md:w-[49%]">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero documents detected!</p>
      </li>
    );
  }

  return (
    <>
      {documents?.map((document) => (
        <li key={document.id} className="w-full md:w-[49%]">
          <Card className="bg-secondary p-1">
            <CardContent className="relative flex flex-col gap-4 rounded-lg bg-white p-3">
              {document.type == "internal" ? (
                <IoDocumentText className="absolute left-[40%] right-[40%] top-[25%] h-20 w-[20%] text-primary" />
              ) : (
                <IoDocumentAttach className="absolute left-[40%] right-[40%] top-[25%] h-20 w-[20%] text-light-orange" />
              )}

              <div className="flex justify-between">
                <Badge variant="outline" className="bg-white py-1">
                  {parseDate(document.createdAt)}
                </Badge>
                {(currentRole == "ADMIN" ||
                  currentRole == "MANAGER" ||
                  document.createdBy === user.id) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="focus:hidden">
                      <IoEllipsisVertical onClick={clickAnimation} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {document.type == "external" && (
                        <>
                          <EditDocumentModal document={document} />
                          <DropdownMenuSeparator />
                        </>
                      )}

                      {
                        <>
                          <DeleteDocumentAlert document={document} />
                        </>
                      }
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div className="text flex h-20 w-2/3 items-end">
                <h3 className="truncate text-lg font-semibold md:text-xl">
                  {document.title}
                </h3>
              </div>
            </CardContent>
            <CardFooter className="mb-2 mt-4 flex items-center justify-between gap-4 p-0 px-2">
              <div>
                <Avatar className="h-8 w-8 md:h-8 md:w-8">
                  <AvatarImage src={document.user?.avatar as string} />
                  <AvatarFallback>
                    <UserDiceAvater email={document.user?.email} />
                  </AvatarFallback>
                </Avatar>
              </div>
              <Link
                href={
                  document.type == "external"
                    ? `${document.link}`
                    : `${pathname}/editor?doc=${document.id}`
                }
                target={document.type == "external" ? "_blank" : "_top"}
                onClick={clickAnimation}
              >
                <Button className="rounded-full bg-black text-white transition hover:bg-gray-800">
                  {document.type == "external" ? `View link` : `Open editor`}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </>
  );
}
