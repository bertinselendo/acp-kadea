"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProjectCredentials } from "./credentials.action";
import ListCredentialsLoop from "./listCredentialsLoop";
import AddcredentialsModal from "./addcredentialsModal";

export default function ListCredentials(params: { projectID: string }) {
  const [credentials, setCredentials] = useState<any>(null);

  useQuery({
    queryKey: ["credentials"],
    queryFn: async () => {
      const credentials = await getProjectCredentials(params.projectID);
      if (credentials) {
        setCredentials(credentials);
        return credentials;
      }
    },
  });

  return (
    <div>
      <ul className="flex flex-col gap-4 flex-wrap pt-4 mt-4 border-t">
        <ListCredentialsLoop credentials={credentials} />

        <li className="text-end">
          <AddcredentialsModal projectID={params.projectID} />
        </li>
      </ul>
    </div>
  );
}
