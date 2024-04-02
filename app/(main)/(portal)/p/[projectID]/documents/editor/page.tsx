import TailwindAdvancedEditor from "@/components/novel/advanced-editor";
import { type NextRequest } from "next/server";
import { string } from "zod";

export type PageProps = {
  params: {
    projectID: string;
  };
  searchParams: {
    doc: string;
  };
};

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
