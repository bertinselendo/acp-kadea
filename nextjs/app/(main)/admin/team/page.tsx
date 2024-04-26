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
    <div className="flex h-full">
      <div className="md:w-7/12 p-4 flex flex-col gap-4">
        <OrgDashtHeader org={organization} />
        <div className="grid grid-cols-2">
          <OrgGeneraleStats org={organization} />
        </div>
      </div>
      <div className="md:w-5/12 p-4 border-l flex flex-col gap-2 h-full overflow-y-scroll">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Members</h2>
          {role == "ADMIN" && <AddMemberModal />}
        </div>
        <TeamListMembers />
      </div>
    </div>
  );
}
