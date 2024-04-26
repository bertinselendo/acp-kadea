import { auth } from "@/lib/auth/helper";
import { getServerUrl } from "@/lib/server-url";
import type { LayoutParams } from "@/types/next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function RouteLayout(props: {
  children: ReactNode;
  params: any;
}) {
  const user = await auth();

  if (!user)
    redirect(
      `/login?callbackUrl=${getServerUrl()}/p/${
        props.params?.projectID
      }/feedbacks`
    );
  return <div className="w-full flex justify-center">{props.children}</div>;
}
