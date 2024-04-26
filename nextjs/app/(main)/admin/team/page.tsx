import { Skeleton } from "@/components/ui/skeleton";
import AddMemberModal from "./addMemberModal";
import TeamListMembers from "@/components/admin/team/members/listMembers";
import { Metadata } from "next";
import { auth, userRole } from "@/lib/auth/helper";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import OrgDashtHeader from "@/components/admin/team/organisation/dashHeader";
import { OrgGeneraleStats } from "@/components/admin/team/organisation/orgGeneraleStats";
import { getOrganization } from "@/components/admin/team/members/members.action";

export const metadata: Metadata = {
  title: "Team",
};

export type TeamPageProps = {};

export default async function TeamPage(props: TeamPageProps) {
  const user = await auth();

  if (!user) redirect("/login");

  const role = user.role;

  if (role !== "ADMIN" && role !== "MANAGER" && role !== "WORKER") {
    redirect("/admin");
  }

  const organization = await getOrganization(user.organizationId);

  if (!organization) return;

  return (
    <div className="flex h-max flex-col md:h-full md:flex-row">
      <div className="flex flex-col gap-4 p-4 md:w-8/12 xl:w-7/12">
        <OrgDashtHeader org={organization} />
        <div className="grid grid-cols-1 md:grid-cols-2">
          <OrgGeneraleStats org={organization} />
        </div>
      </div>
      <div className="flex h-full flex-col gap-2 overflow-y-scroll border-l p-4 md:w-4/12 xl:w-5/12">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Members</h2>
          {role == "ADMIN" && <AddMemberModal />}
        </div>
        <TeamListMembers />
      </div>
    </div>
  );
}
