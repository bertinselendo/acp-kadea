import { PageParams } from "@/types/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default function ProjectPage({
  params,
}: {
  params: { clientID: string };
}) {
  return <div>Project of {params.clientID}</div>;
}
