import Header from "@/layout/header";
import SidebarGlobal from "@/layout/sidebar";
import { auth } from "@/lib/auth/helper";
import type { LayoutParams } from "@/types/next";

export default async function RouteLayout(props: LayoutParams<{}>) {
  const user = await auth();

  return (
    <main className="flex min-h-screen">
      <SidebarGlobal />
      <div className="w-full">
        <Header user={user} />
        <div className="p-3">{props.children}</div>
      </div>
    </main>
  );
}
