import { clickAnimation } from "@/components/ui/click-animation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { parseDate, relativeDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamMember, User } from "@prisma/client";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";

export type ListSingleProjectProps = {
  projects:
    | [
        {
          id: string;
          title: string;
          description: string;
          cover: string;
          priority: string;
          startDate: Date;
          endDate: Date;
          status: string;
          tags: string;
          teamMembers: [TeamMember & { user: User }];
        },
      ]
    | null;
};

export default function ListSingleProject(props: ListSingleProjectProps) {
  const projects = props.projects;

  if (!projects) {
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

  if (!projects.length) {
    return (
      <li className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border bg-transparent p-8 text-center text-sm md:w-[49%]">
        <p className="text-2xl">😔</p>
        <p>Looks like a client is on a diet - zero project detected!</p>
      </li>
    );
  }

  return (
    <>
      {projects?.map((project) => (
        <li key={project.id} className="w-full md:w-[49%]">
          <Card className="p-1">
            <CardContent
              className="flex flex-col gap-4 rounded-lg p-4"
              style={{ background: project.cover }}
            >
              <div className="flex justify-between">
                <Badge variant="outline" className="bg-white py-1">
                  {parseDate(project.startDate)}
                </Badge>
                {}
                <Badge variant="outline" className="bg-white py-1">
                  {project.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm font-semibold">{project.priority}</div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <div className="flex gap-2">
                    {project.teamMembers.map((team, index) => (
                      <Avatar key={index} className="h-7 w-7">
                        <AvatarImage src={team.user.avatar as string} />
                        <AvatarFallback>
                          <UserDiceAvater email={team.user.email} />
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.split(",").map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-black py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="mb-2 mt-4 flex items-center justify-between gap-4 p-0 px-2">
              <div>
                <h6 className="text-lg font-semibold leading-none">
                  Due {relativeDate(project.endDate)}
                </h6>
                <p className="text-sm">{parseDate(project.endDate)}</p>
              </div>
              <Link href={`/p/${project.id}`}>
                <Button className="rounded-full bg-black text-white transition hover:bg-gray-800">
                  Dashboard
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </li>
      ))}
    </>
  );
}
