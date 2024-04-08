import type { LayoutParams } from "@/types/next";
import { ReactNode } from "react";

export default async function RouteLayout(props: { children: ReactNode }) {
  return <div className="w-full flex justify-center">{props.children}</div>;
}
