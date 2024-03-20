import { Skeleton } from "@/components/ui/skeleton";
import AddMemberModal from "./addMemberModal";
import TeamListMembers from "@/components/admin/team/members/listMembers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team",
};

export type PageProps = {};

export default function Page(props: PageProps) {
  return (
    <div className="flex min-h-[90vh]">
      <div className="md:w-2/3 p-4">
        <Skeleton className="w-full h-80" />
      </div>
      <div className="md:w-1/3 p-4 border-l flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Members</h2>
          <AddMemberModal />
        </div>
        <TeamListMembers />
      </div>
    </div>
  );
}
