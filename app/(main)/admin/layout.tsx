import type { LayoutParams } from "@/types/next";
import { ReactNode } from "react";

export default async function RouteLayout(props: { children: ReactNode }) {
  return <div className="page-admin h-full ">{props.children}</div>;
}
