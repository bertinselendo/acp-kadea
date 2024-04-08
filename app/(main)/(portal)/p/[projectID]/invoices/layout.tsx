import type { LayoutParams } from "@/types/next";

export default async function RouteLayout(props: LayoutParams<{}>) {
  return <div className="w-full flex justify-center">{props.children}</div>;
}
