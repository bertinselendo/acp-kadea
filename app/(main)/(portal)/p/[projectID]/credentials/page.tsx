import ListCredentials from "@/components/admin/credentials/listCredentials";
import ListFeedbacks from "@/components/admin/feedbacks/listFeeddbacks";

export type PageProps = {};

export default function Page({ params }: any) {
  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-[600px]">
      <div className="text-xl font-bold">Credentials</div>
      <div>
        <ListCredentials projectID={params.projectID} />
      </div>
    </div>
  );
}
