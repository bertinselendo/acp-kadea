"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { getProjectFeedbacks } from "@/components/admin/feedbacks/feedback.action";

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  DotButton,
  useDotButton,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";
import { clickAnimation } from "@/components/ui/click-animation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { parseDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashFeedbacks(params: { projectID: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api);

  const { isPending, data } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      try {
        return await getProjectFeedbacks(params.projectID);
      } catch (error) {
        throw error;
      }
    },
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-48 w-full" />
        <div className="flex gap-2 *:h-10">
          <Skeleton className="w-8/12 delay-500" />
          <Skeleton className="w-4/12 delay-1000" />
        </div>
      </div>
    );
  }

  if (data?.length) {
    return (
      <div>
        <Carousel
          setApi={setApi}
          className="flex h-60 w-full flex-col justify-between gap-0"
        >
          <CarouselContent className="h-[190px] rounded-lg">
            {data.map((feedback: any, index: any) => (
              <CarouselItem key={index}>
                <Card className="h-full border-none shadow-none">
                  <CardContent className="flex h-full flex-col justify-between gap-4 rounded-lg bg-primary p-4">
                    <div className="flex justify-between">
                      <Badge variant="outline" className="bg-white py-1">
                        {parseDate(feedback.createdAt)}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="w-1/2 text-xl font-semibold">
                        {feedback.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <Avatar className="h-8 w-8 md:h-8 md:w-8">
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
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="m-0 flex h-12 w-full items-center justify-between gap-4 px-2">
            <div className="flex gap-2">
              <CarouselPrevious className="relative left-0 top-0 translate-y-0" />
              <CarouselNext className="relative right-0 top-0 translate-y-0" />
            </div>
            <div>
              <div className="flex gap-2">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={"h-4 w-4 rounded-full border bg-secondary"}
                    style={{
                      background: index === selectedIndex ? " #d5f6ee" : "",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </Carousel>
      </div>
    );
  }

  return (
    <div className="flex h-60 w-full flex-col items-center justify-center gap-2">
      <p>No feedbacks</p>
    </div>
  );
}
