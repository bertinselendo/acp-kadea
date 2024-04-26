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
      <ul className="flex gap-x-[2%] gap-y-4 flex-wrap pt-4 mt-4 border-t">
        <ListFeedbacksLoop feedbacks={feedbacks} />

        <li className="w-[49%]">
          <Card className="p-1 h-[100%] min-h-40 w-full">
            <CardContent className="rounded-lg p-4 flex flex-col gap-4 text-center items-center h-[100%] justify-center">
              {/* <h3 className="font-semibold text-xl">New project ?</h3> */}
              <AddFeedbackModal projectID={params.projectID} />
            </CardContent>
          </Card>
        </li>
      </ul>
    </div>
  );
}
