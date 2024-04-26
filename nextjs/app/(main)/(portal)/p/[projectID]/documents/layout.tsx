import "@app/prosemirror.css";
import type { LayoutParams } from "@/types/next";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerUrl } from "@/lib/server-url";
import { auth } from "@/lib/auth/helper";

export default async function RouteLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: any;
}) {
  const user = await auth();

  if (!user)
    redirect(
      `/login?callbackUrl=${getServerUrl()}/p/${params?.projectID}/documents`
    );

  return <div className="w-full flex justify-center">{children}</div>;
}
