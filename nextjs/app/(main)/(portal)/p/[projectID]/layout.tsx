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

  if (user) {
    const projectUsers = await getProjectAllUsers(params.projectID);
    const projectUser = projectUsers?.filter(
      (projectUser) => projectUser.id == user?.id,
    );

    if (projectUser?.length == 0) {
      if (isClient(user)) {
        notFound();
      }
      if (isWorker(user)) {
        return <div>You have not access</div>;
      }
    }
  }

  return (
    <div className="relative h-full">
      <div className="sticky top-0 z-20 h-14 border-b bg-background px-4">
        {user && <ProjectNavMenu user={user} />}
      </div>
      <div className="-mt-14 flex h-max flex-col overflow-hidden pt-14 md:h-full md:flex-row">
        <div className="flex justify-center overflow-y-scroll px-0 py-0 md:w-8/12 md:px-6 md:py-3 2xl:w-9/12">
          <div className="flex w-full flex-col items-center pb-24 md:pb-0">
            {children}
          </div>
        </div>
        <div className="border-l px-3 md:w-4/12 2xl:w-3/12">
          {user && <MessagePanel user={user} />}
        </div>
      </div>
    </div>
  );
}
