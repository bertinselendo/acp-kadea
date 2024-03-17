import Header from "@/layout/header";
import SidebarGlobal from "@/layout/sidebar";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";
import { redirect } from "next/navigation";

export default async function RouteLayout(props: LayoutParams<{}>) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen relative">
      <SidebarGlobal />
      <div className="w-full">
        <Header user={user} />
        <div>{props.children}</div>
      </div>
    </main>
  );
}
