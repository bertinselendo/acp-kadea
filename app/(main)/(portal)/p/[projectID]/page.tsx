import { getClientSingleProject } from "@/components/admin/projects/project.action";
import { Skeleton } from "@/components/ui/skeleton";
import { PageParams } from "@/types/next";
import type { Metadata, ResolvingMetadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { parseDate, relativeDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectHeader from "@/components/admin/projects/single/projectHeader";
import { Project } from "@prisma/client";
import DashFeedbacks from "@/components/admin/projects/single/dashboard/feedbacks";
import AddFeedbackModal from "@/components/admin/feedbacks/addFeedbackModal";

type Props = {
  params: { projectID: string };
};

export const metadata: Metadata = {
  title: "",
  description: "",
};

// export async function generateMetadata({ params }: Props) {
//   const project = await getClientSingleProject(params.projectID);
//   if (project) {
//     return {
//       title: project.clientID + ": " + project.title,
//     };
//   }
// }

export default async function ProjectSinglePage({ params }: Props) {
  const project = await getClientSingleProject(params.projectID);

  return (
    <div className="w-full p-4 flex flex-col gap-6">
      <ProjectHeader project={project as Project} />

      <div className="flex gap-6">
        <Card className="h-80 w-1/2">
          <CardContent className="flex flex-col h-full gap-4 p-4">
            <div className="flex justify-between items-center">
              <CardTitle>Feedbacks</CardTitle>
              <AddFeedbackModal projectID={params.projectID} />
            </div>
            <DashFeedbacks projectID={params.projectID} />
          </CardContent>
        </Card>
        <Card className="h-80 w-1/2">
          <CardContent className="flex flex-col h-full gap-4 p-4">
            <CardTitle>Document</CardTitle>
            <div className="grid grid-rows-2 grid-flow-col gap-4 *:h-28">
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex gap-6">
        <Card className="h-80 w-1/2">
          <CardContent className="flex flex-col h-full gap-4 p-4">
            <CardTitle>Invoices</CardTitle>
            <div className="grid grid-rows-1 grid-flow-col gap-4 *:h-60">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </CardContent>
        </Card>
        <Card className="h-80 w-1/2">
          <CardContent className="flex flex-col h-full gap-4 p-4">
            <CardTitle>Credentials</CardTitle>
            <div className="flex flex-col gap-4 *:h-10">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          </CardContent>
        </Card>
      </div>
      <div>{/* <ListProjects clientID={params.clientID} /> */}</div>
    </div>
  );
}
