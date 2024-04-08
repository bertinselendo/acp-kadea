import { Metadata } from "next";

export type PageProps = {};

export const metadata: Metadata = {
  title: "Activity",
};

export default function Page(props: PageProps) {
  return "activity";
}
