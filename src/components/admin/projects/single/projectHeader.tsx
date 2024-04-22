"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseDate, relativeDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project, TeamMember, User } from "@prisma/client";
import { getTeamMembers, getUser } from "../../team/members/members.action";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserDiceAvater } from "@/components/auth/userDiceAvater";

type ProjectHeaderProps = {
  project: Project;
};

type ProjectTypes = Project & {
  teamMembers: [TeamMember];
};

export default function ProjectHeader(props: ProjectHeaderProps) {
  const [teams, setTeams] = useState<User[]>([]);
  const project = props.project as ProjectTypes;

  useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const members = await getTeamMembers();
      if (members) {
        const teamArray: any = [];
        project.teamMembers.map((team) => {
          const sme = members.find((member) => member.id == team.userId);
          if (sme) teamArray.push(sme);
          setTeams(teamArray);
        });

        return members;
      }
    },
  });

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
          <div className="flex justify-end px-2 gap-2">
            {teams.map((team, index) => (
              <Avatar key={index}>
                <AvatarImage src={team?.avatar as string} />
                <AvatarFallback>
                  <UserDiceAvater email={team?.email} />
                </AvatarFallback>
              </Avatar>
            ))}
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
