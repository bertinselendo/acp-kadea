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
import { Feedback, User } from "@prisma/client";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoEllipsisHorizontal, IoEllipsisVertical } from "react-icons/io5";
import { useSession } from "next-auth/react";
import EditMemberModal from "../team/members/editMemberForm";
import { DeleteMemberAlert } from "../team/members/deleteMemberAlert";
import { DeleteFeedbackAlert } from "./deleteFeedbackAlert";
import DeleteFeedbackModal from "./editFeedbackModal";
import EditFeedbackModal from "./editFeedbackModal";

export type ListFeedbacksLoopProps = {
  feedbacks: [
    Feedback & {
      user: User;
    },
  ];
};

export default function ListFeedbacksLoop(props: ListFeedbacksLoopProps) {
  const feedbacks = props.feedbacks;

  const { data } = useSession();
  const user = data?.user as User;
  const currentRole = user?.role;

  if (!feedbacks) {
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

  if (!feedbacks.length) {
    return (
      <li className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border bg-transparent p-8 text-center text-sm md:w-[49%]">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero feedbacks detected!</p>
      </li>
    );
  }

  return (
    <>
      {feedbacks?.map((feedback) => (
        <li key={feedback.id} className="w-full md:w-[49%]">
          <Card className="p-1">
            <CardContent
              className="flex flex-col gap-4 rounded-lg bg-light-green p-4"
              // style={{ background: project.cover }}
            >
              <div className="flex justify-between">
                <Badge variant="outline" className="bg-white py-1">
                  {parseDate(feedback.createdAt)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:hidden">
                    <IoEllipsisVertical onClick={clickAnimation} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <EditFeedbackModal feedback={feedback} />

                    {/* <DropdownMenuItem>Make a call</DropdownMenuItem> */}

                    {(currentRole == "ADMIN" || currentRole == "MANAGER") && (
                      <>
                        <DropdownMenuSeparator />
                        <DeleteFeedbackAlert feedback={feedback} />
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <h3 className="w-1/2 text-xl font-semibold">
                  {feedback.title}
                </h3>
              </div>
            </CardContent>
            <CardFooter className="mb-2 mt-4 flex items-center justify-between gap-4 p-0 px-2">
              <div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={feedback.user?.avatar as string} />
                  <AvatarFallback>
                    <UserDiceAvater email={feedback.user?.email} />
                  </AvatarFallback>
                </Avatar>
              </div>
              <Link
                href={`${feedback.link}`}
                target="_blank"
                onClick={clickAnimation}
              >
                <Button className="rounded-full bg-black text-white transition hover:bg-gray-800">
                  Consulter
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </>
  );
}
