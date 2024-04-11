import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/helper";
import type { PageParams } from "@/types/next";
import { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { getClientData } from "./update.action";
import PageTabs from "./pageTabs";

export const metadata: Metadata = {
  title: "Setting",
};

export default async function ClientSettingPage(
  props: PageParams<{ clientID: string }>
) {
  const user = await auth();

  if (!user) {
    redirect("/login");
  }

  const client = await getClientData(props.params.clientID);

  if (!client) return;

  return (
    <div className="flex flex-col w-[600px] mx-auto pb-20">
      <div className="my-4 text-left">
        <h2 className="text-2xl font-bold">
          {client?.companyName}&apos;s settings
        </h2>
      </div>

      <PageTabs client={client} user={user} />
    </div>
  );
}
