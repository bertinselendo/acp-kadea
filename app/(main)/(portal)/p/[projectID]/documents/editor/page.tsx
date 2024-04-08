import { getProjectDocumentTitle } from "@/components/admin/documents/documents.action";
import TailwindAdvancedEditor from "@/components/novel/advanced-editor";
import { ResolvingMetadata } from "next";

export type PageProps = {
  params: {
    projectID: string;
  };
  searchParams: {
    doc: string;
  };
};

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
) {
  if (searchParams.doc) {
    const title = await getProjectDocumentTitle(searchParams.doc);
    const parentTitle = (await parent).title?.absolute;
    const newTitle = `${parentTitle} : ${title}`;
    if (title) {
      return {
        title: newTitle,
      };
    }
  }
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <div className="w-full">
      <TailwindAdvancedEditor
        projectID={params.projectID}
        documentID={searchParams.doc}
      />
    </div>
  );
}
