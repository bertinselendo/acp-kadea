"use client";

import { useEffect, useState } from "react";
import ListSingleProject from "./listSingleProject";

import { Card, CardContent } from "@/components/ui/card";

import { getClientProjects } from "./project.action";
import AddProjectModal from "./addProjectModal";

export type ListProjectsProps = [
  {
    projects: string;
  }
];

export default function ListProjects(params: { clientID: string }) {
  const [projects, setprojects] = useState<any | null>(null);
  // const [filteredClients, setfilteredClients] =
  //   useState<ListClientsProps | null>(null);
  // const [search, setSearch] = useState("");
  // const [filter, setFilter] = useState("");
  // const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const projects = await getClientProjects(params.clientID);
      if (projects) {
        setprojects(projects as any);
        // setfilteredClients(client as any);
      }
    };
    fetchData();
  }, [params]);

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

      <ul className="flex gap-x-[2%] gap-y-4 flex-wrap pt-4 mt-4 border-t">
        <ListSingleProject projects={projects} />

        <li className="w-[49%]">
          <Card className="p-1 h-[100%] min-h-52 w-full">
            <CardContent className="rounded-lg p-4 flex flex-col gap-4 text-center items-center h-[100%] justify-center">
              <h3 className="font-semibold text-xl">New project ?</h3>
              <AddProjectModal clientID={params.clientID} />
            </CardContent>
          </Card>
        </li>
      </ul>
    </div>
  );
}
