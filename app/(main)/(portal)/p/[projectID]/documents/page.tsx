import ListDocuments from "@/components/admin/documents/listDocuments";

export type PageProps = {};

export default function Page({ params }: any) {
  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-[600px]">
      <div className="text-xl font-bold">Documents</div>
      <div>
        <ListDocuments projectID={params.projectID} />
      </div>
    </div>
  );
}
