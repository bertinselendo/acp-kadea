"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseDate, relativeDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project } from "@prisma/client";

export type ProjectHeaderProps = {
  project: Project;
};

export default function ProjectHeader(props: ProjectHeaderProps) {
  const project = props.project;
  return (
    <Card
      className="border-none h-80"
      style={{ background: `linear-gradient(${project?.cover}, #fff)` }}
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
          <div className="flex justify-end px-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
          <div className="w-full flex justify-between">
            <div className="w-4/5">
              <div className="text-sm font-semibold">{project?.priority}</div>
              <h3 className="font-semibold text-2xl">{project?.title}</h3>
              <p>{project?.description}</p>
            </div>
            <div className="flex justify-between items-center w-1/5"></div>
          </div>
          <div className="w-full flex justify-between">
            <div className="flex gap-2 flex-wrap items-center">
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
            <div>
              <h6 className="text-lg font-semibold leading-none">
                Due {relativeDate(project?.endDate)}
              </h6>
              <p className="text-sm">{parseDate(project?.endDate)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
