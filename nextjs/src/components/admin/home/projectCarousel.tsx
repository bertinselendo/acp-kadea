"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCurrentUserProjects } from "../projects/project.action";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { parseDate } from "@/lib/utils";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminHomeCarousel({ user }: { user: User }) {
  const [projects, setProjects] = useState(null);

  useQuery({
    queryKey: ["home-project"],
    queryFn: async () => {
      const projects = await getCurrentUserProjects();
      setProjects(projects);
      return projects;
    },
  });

  if (!projects) {
    return (
      <div className="flex gap-4 *:w-1/4 *:border">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex gap-4 *:w-1/4 *:border">
        <Card>
          <CardContent className="flex h-40 items-center justify-center p-6">
            No project for this moment
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {projects.map((project, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <Link href={`/p/${project.id}`}>
              <Card
                style={{
                  background: `linear-gradient(${project?.cover}, #fff)`,
                }}
              >
                <CardContent className="flex flex-col justify-between h-full gap-8 p-4">
                  <div className="w-full flex justify-between">
                    <Badge variant="outline" className="bg-white py-1">
                      {parseDate(project?.startDate)}
                    </Badge>
                    <Badge variant="outline" className="bg-white py-1">
                      {project?.status}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="w-full flex justify-between">
                      <div className="w-full">
                        <div className="text-sm font-semibold truncate">
                          {project?.client.companyName}
                        </div>
                        <h3 className="font-semibold text-xl truncate">
                          {project?.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center overflow-y-scroll scroll-m-0">
                      {project?.tags?.split(",").map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="border-black py-1 h-fit"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
