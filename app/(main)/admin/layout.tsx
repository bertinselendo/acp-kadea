import type { LayoutParams } from "@/types/next";

export default async function RouteLayout(props: LayoutParams<{}>) {
  return <div className="page-admin">{props.children}</div>;
}
