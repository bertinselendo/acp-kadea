import type { LayoutParams } from "@/types/next";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default async function RouteLayout(props: { children: ReactNode }) {
  return <>{props.children}</>;
}
