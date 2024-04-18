"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseDate, relativeDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Project, TeamMember, User } from "@prisma/client";
import Image from "next/image";

// type ProjectHeaderProps = {
//   org: Project;
// };

type ProjectTypes = Project & {
  teamMembers: [TeamMember];
};

export default function OrgDashtHeader(props) {
  const org = props.org as ProjectTypes;

  return (
    <Card
      className="border-none h-80"
      style={{ background: `linear-gradient(#ddd, #fff)` }}
    >
      <CardContent className="flex flex-col justify-between h-full gap-8 p-4">
        <div className="w-full flex justify-between">
          <Badge variant="outline" className="bg-white py-1">
            Date
          </Badge>
          <Badge variant="outline" className="bg-white py-1">
            2 members
          </Badge>
        </div>
        <div className="flex gap-4 items-end justify-between">
          <div className="w-4/5">
            {/* <Image
              src="/"
              alt=""
              width={80}
              height={80}
              className="aspect-square rounded-full bg-secondary w-20 h-20 mb-2"
            /> */}
            <h3 className="font-semibold text-2xl">Title</h3>
            <p>Description</p>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <Badge variant="outline" className="border-black py-1 h-fit">
              tag
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
