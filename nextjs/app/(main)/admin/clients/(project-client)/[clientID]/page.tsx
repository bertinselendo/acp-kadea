import { getSingleClient } from "@/components/admin/clients/clients.action";
import ListProjects from "@/components/admin/projects/listProjects";
import { isTeamMember } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import { getServerUrl } from "@/lib/server-url";
import { PageParams } from "@/types/next";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: { clientID: string };
}) {
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

  if (!user)
    redirect(
      `/login?callbackUrl=${getServerUrl()}/admin/clients/${params?.clientID}`
    );

  const client: { companyName: string } | null = await getSingleClient(
    params.clientID
  );

  if (!client) {
    notFound();
  }

  return (
    <div>
      <h2 className="h2">{client?.companyName}&apos;s Projects</h2>
      <div>
        <ListProjects clientID={params.clientID} user={user} />
      </div>
    </div>
  );
}
