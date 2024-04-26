"use client";

import { useEffect, useState } from "react";
import ListSingleProject from "./listSingleProject";

import { Card, CardContent } from "@/components/ui/card";

import { getClientProjects } from "./project.action";
import AddProjectModal from "./addProjectModal";
import { User } from "@prisma/client";
import { isTeamManager, isTeamMember } from "@/lib/auth/auth-utils";

export type ListProjectsProps = { clientID: string; user: User };

export default function ListProjects({ clientID, user }: ListProjectsProps) {
  const [projects, setprojects] = useState<any | null>(null);
  // const [filteredClients, setfilteredClients] =
  //   useState<ListClientsProps | null>(null);
  // const [search, setSearch] = useState("");
  // const [filter, setFilter] = useState("");
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const projects = await getClientProjects(clientID);
      if (projects) {
        setprojects(projects as any);
        // setfilteredClients(client as any);
      }
    };
    fetchData();
  }, [clientID]);

  // const handlerSearch = (event: any, type: string | null = null) => {
  //   let query = type ? event : event.target.value;
  //   let where = "companyName";

  //   if (!type) {
  //     setSearch(query);
  //     setFilter("");
  //   }

  //   if (type) {
  //     where = type;
  //     setFilter(query);
  //     setSearch("");
  //   }

  //   const res = clients?.filter((obj: any) =>
  //     obj[where].toLowerCase().includes(query.toLowerCase())
  //   );

  //   setfilteredClients(res as ListClientsProps | null);
  // };

  return (
    <div>
      {/* <ClientSearchForm
        clients={clients}
        handlerSearch={handlerSearch}
        search={search}
        open={open}
        setOpen={setOpen}
        filter={filter}
        setFilter={setFilter}
      /> */}

      <ul className="mt-4 flex flex-wrap gap-x-[2%] gap-y-4 border-t pt-4">
        <ListSingleProject projects={projects} />

        {isTeamManager(user) && (
          <li className="w-full md:w-[49%]">
            <Card className="h-[100%] min-h-52 w-full p-1">
              <CardContent className="flex h-[100%] flex-col items-center justify-center gap-4 rounded-lg p-4 text-center">
                <h3 className="text-xl font-semibold">New project ?</h3>
                <AddProjectModal clientID={clientID} />
              </CardContent>
            </Card>
          </li>
        )}
      </ul>
    </div>
  );
}
