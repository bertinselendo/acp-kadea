import "@app/prosemirror.css";
import ListClients from "@/components/admin/clients/listClients";
import ProjectNavMenu from "@/components/admin/projects/single/projectNavMenu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documents",
};

export default async function RouteLayout(props: LayoutParams<{}>) {
  return <div className="w-full flex justify-center">{props.children}</div>;
}
