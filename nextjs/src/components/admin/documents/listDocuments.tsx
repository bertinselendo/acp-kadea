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
      <ul className="mt-4 flex flex-col flex-wrap gap-x-[2%] gap-y-4 border-t pt-4 md:flex-row">
        <ListDocumentsLoop documents={documents} />

        <li className="w-full md:w-[49%]">
          <Card className="flex h-[100%] min-h-40 w-full flex-col items-center justify-center p-1">
            <CardContent className="w-full space-y-2 rounded-lg p-4 text-center">
              {/* <h3 className="font-semibold text-xl">New project ?</h3> */}
              <AddDocumentModal projectID={params.projectID} />
            </CardContent>
          </Card>
        </li>
      </ul>
    </div>
  );
}
