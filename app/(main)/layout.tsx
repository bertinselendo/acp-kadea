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
    <main className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%">
      <div className="flex min-h-screen relative bg-blend-overlay bg-noise bg-white/80">
        <SidebarGlobal />
        <div className="w-full ">
          <div className="flex justify-between items-center p-3 h-[6vh] --border border-b sticky top-0 z-50 overflow-hidden">
            <Header user={user} />
          </div>
          <div className="bg-background/80 h-[94vh] overflow-y-scroll">
            {props.children}
          </div>
        </div>
      </div>
    </main>
  );
}
