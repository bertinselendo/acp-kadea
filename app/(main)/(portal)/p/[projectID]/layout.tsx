import {
  getClientSingleProject,
  getProjectAllUsers,
} from "@/components/admin/projects/project.action";
import ProjectNavMenu from "@/components/admin/projects/single/projectNavMenu";
import MessagePanel from "@/components/chat/messagePanel";
import { isClient, isWorker } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { notFound, redirect } from "next/navigation";
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: LayoutParams<{ projectID: string }>) {
  const project = await getClientSingleProject(params.projectID);
  if (project) {
    return {
      title: project.title,
    };
  }
}

export default async function RouteLayout({
  params,
  children,
}: {
  params: { projectID: string };
  children: ReactNode;
}) {
  const user = await auth();

  if (!user) redirect("/admin");

  const projectUsers = await getProjectAllUsers(params.projectID);
  const projectUser = projectUsers?.filter(
    (projectUser) => projectUser.id == user?.id
  );

  if (projectUser?.length == 0) {
    if (isClient(user)) {
      notFound();
    }
    if (isWorker(user)) {
      return <div>You have not access</div>;
    }
  }

  return (
    <div className="h-full relative">
      <div className="px-4 border-b h-14 sticky top-0">
        <ProjectNavMenu user={user} />
      </div>
      <div className="flex h-full -mt-14 pt-14 overflow-hidden">
        <div className="py-3 px-6 2xl:w-9/12 md:w-8/12 flex justify-center overflow-y-scroll">
          <div className="w-full flex flex-col items-center">{children}</div>
        </div>
        <div className="px-3 2xl:w-3/12 md:w-4/12 border-l">
          <MessagePanel user={user} />
        </div>
      </div>
    </div>
  );
}
