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
    }
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
      <li className="w-[49%] animate-pulse border bg-transparent rounded-lg p-4 flex flex-col gap-4">
        <Skeleton className="h-40 w-full delay-250" />
        <div className="flex gap-10">
          <Skeleton className="h-10 w-2/3 delay-500" />
          <Skeleton className="h-10 w-1/3 delay-750" />
        </div>
      </li>
    );
  }

  if (!documents.length) {
    return (
      <li className="w-[49%] border bg-transparent rounded-lg flex flex-col gap-4 text-sm items-center justify-center text-center p-8">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero documents detected!</p>
      </li>
    );
  }

  return (
    <>
      {documents?.map((document) => (
        <li key={document.id} className="w-[49%]">
          <Card className="p-1 bg-secondary">
            <CardContent className="relative rounded-lg p-3 flex flex-col gap-4 bg-white">
              {document.type == "internal" ? (
                <IoDocumentText className="absolute w-[20%] left-[40%] right-[40%] top-[25%] h-20 text-primary" />
              ) : (
                <IoDocumentAttach className="absolute w-[20%] left-[40%] right-[40%] top-[25%] h-20 text-light-orange" />
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
              <div className="w-2/3 h-20 flex items-end text">
                <h3 className="font-semibold text-xl truncate">
                  {document.title}
                </h3>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 justify-between mt-4 mb-2 p-0 px-2 items-center">
              <div>
                <Avatar className="h-8 w-8">
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
                <Button className="bg-black text-white rounded-full transition hover:bg-gray-800">
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
