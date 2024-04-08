"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectDocuments } from "./documents.action";
import ListDocumentsLoop from "./listDocumentsLoop";
import AddDocumentModal from "./addDocumentModal";
import { Card, CardContent } from "@/components/ui/card";

export default function ListDocuments(params: { projectID: string }) {
  const [documents, setDocuments] = useState<any>(null);

  useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const documents = await getProjectDocuments(params.projectID);
      if (documents) {
        setDocuments(documents);
        return documents;
      }
    },
  });

  return (
    <div>
      <ul className="flex gap-x-[2%] gap-y-4 flex-wrap pt-4 mt-4 border-t mb-[40vh]">
        <ListDocumentsLoop documents={documents} />

        <li className="w-[49%]">
          <Card className="p-1 h-[100%] min-h-40 w-full">
            <CardContent className="rounded-lg p-4 flex flex-col gap-4 text-center items-center h-[100%] justify-center">
              {/* <h3 className="font-semibold text-xl">New project ?</h3> */}
              <AddDocumentModal projectID={params.projectID} />
            </CardContent>
          </Card>
        </li>
      </ul>
    </div>
  );
}
