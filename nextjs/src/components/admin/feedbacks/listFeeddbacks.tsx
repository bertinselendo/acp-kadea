"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectFeedbacks } from "./feedback.action";
import ListFeedbacksLoop from "./listFeedbacksLoop";
import AddFeedbackModal from "./addFeedbackModal";
import { Card, CardContent } from "@/components/ui/card";

export default function ListFeedbacks(params: { projectID: string }) {
  const [feedbacks, setFeedbacks] = useState<any>(null);

  useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const feedbacks = await getProjectFeedbacks(params.projectID);
      if (feedbacks) {
        setFeedbacks(feedbacks);
        return feedbacks;
      }
    },
  });

  return (
    <div>
      <ul className="mt-4 flex flex-col flex-wrap gap-x-[2%] gap-y-4 border-t pt-4 md:flex-row">
        <ListFeedbacksLoop feedbacks={feedbacks} />

        <li className="w-full md:w-[49%]">
          <Card className="flex h-[100%] min-h-40 w-full flex-col items-center justify-center p-1">
            <CardContent className="w-full space-y-2 rounded-lg p-4 text-center">
              {/* <h3 className="text-xl font-semibold">New project ?</h3> */}
              <AddFeedbackModal projectID={params.projectID} />
            </CardContent>
          </Card>
        </li>
      </ul>
    </div>
  );
}
