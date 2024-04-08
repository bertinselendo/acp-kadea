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
        <Skeleton className="w-full h-48" />
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
          className="w-full h-60 flex flex-col gap-0 justify-between"
        >
          <CarouselContent className="h-[190px] rounded-lg">
            {data.map((feedback: any, index: any) => (
              <CarouselItem key={index}>
                <Card className="border-none shadow-none h-full">
                  <CardContent className="rounded-lg p-4 flex flex-col justify-between gap-4 bg-primary h-full">
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
                    <div className="flex gap-4 justify-between items-center">
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
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="w-full h-12 flex gap-4 justify-between m-0 px-2 items-center">
            <div className="flex gap-2">
              <CarouselPrevious className="left-0 top-0 translate-y-0 relative" />
              <CarouselNext className="relative right-0 top-0 translate-y-0" />
            </div>
            <div>
              <div className="flex gap-2">
                {scrollSnaps.map((_, index) => (
                  <DotButton
                    key={index}
                    onClick={() => onDotButtonClick(index)}
                    className={"w-4 h-4 rounded-full border bg-secondary"}
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
    <div className="flex flex-col gap-2 h-60 w-full items-center justify-center">
      <p>No feedbacks</p>
    </div>
  );
}
