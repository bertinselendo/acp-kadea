import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function RouteLayout(props: LayoutParams<{}>) {
  return <div>{props.children}</div>;
}
