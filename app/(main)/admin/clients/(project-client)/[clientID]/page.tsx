import { getSingleClient } from "@/components/admin/clients/clients.action";
import ListProjects from "@/components/admin/projects/listProjects";
import { PageParams } from "@/types/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ProjectPage({
  params,
}: {
  params: { clientID: string };
}) {
  const client: { companyName: string } | null = await getSingleClient(
    params.clientID
  );

  return (
    <div>
      <div>Projects of {client?.companyName}</div>
      <div>
        <ListProjects clientID={params.clientID} />
      </div>
    </div>
  );
}
