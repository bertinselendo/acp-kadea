import { getClientSingleProject } from "@/components/admin/projects/project.action";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { redirect } from "next/navigation";

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

export default async function RouteLayout(props: LayoutParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return props.children;
}
