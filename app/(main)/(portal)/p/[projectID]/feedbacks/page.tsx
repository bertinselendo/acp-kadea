import ListFeedbacks from "@/components/admin/feedbacks/listFeeddbacks";

export type PageProps = {};

export default function Page({ params }: any) {
  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-[600px]">
      <div className="text-xl font-bold">Feedbacks</div>
      <div>
        <ListFeedbacks projectID={params.projectID} />
      </div>
    </div>
  );
}
