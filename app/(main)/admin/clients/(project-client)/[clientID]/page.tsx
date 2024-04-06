import { getSingleClient } from "@/components/admin/clients/clients.action";
import ListProjects from "@/components/admin/projects/listProjects";
import { isTeamMember } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import { PageParams } from "@/types/next";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const user = await auth();
  if (isTeamMember(user)) {
    return {
      title: "Clients",
    };
  } else {
    return {
      title: "",
    };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { clientID: string };
}) {
  const user = await auth();

  if (!user) return;

  const client: { companyName: string } | null = await getSingleClient(
    params.clientID
  );

  if (!client) {
    notFound();
  }

  return (
    <div>
      <div>Projects of {client?.companyName}</div>
      <div>
        <ListProjects clientID={params.clientID} user={user} />
      </div>
    </div>
  );
}
