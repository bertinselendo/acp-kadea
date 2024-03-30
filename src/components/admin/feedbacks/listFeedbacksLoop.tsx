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

export type ListFeedbacksLoopProps = {
  feedbacks: [
    Feedback & {
      user: User;
    }
  ];
};

export default function ListFeedbacksLoop(props: ListFeedbacksLoopProps) {
  const feedbacks = props.feedbacks;

  if (!feedbacks) {
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

  if (!feedbacks.length) {
    return (
      <li className="w-[49%] border bg-transparent rounded-lg flex flex-col gap-4 text-sm items-center justify-center text-center p-8">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero feedbacks detected!</p>
      </li>
    );
  }

  return (
    <>
      {feedbacks?.map((feedback) => (
        <li key={feedback.id} className="w-[49%]">
          <Card className="p-1">
            <CardContent
              className="rounded-lg p-4 flex flex-col gap-4 bg-light-green"
              // style={{ background: project.cover }}
            >
              <div className="flex justify-between">
                <Badge variant="outline" className="bg-white py-1">
                  {parseDate(feedback.createdAt)}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-xl w-1/2">
                  {feedback.title}
                </h3>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 justify-between mt-4 mb-2 p-0 px-2 items-center">
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
                <Button className="bg-black text-white rounded-full transition hover:bg-gray-800">
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
