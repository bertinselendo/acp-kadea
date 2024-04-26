import NotificationsList from "@/components/notifications/notificationsList";
import { auth } from "@/lib/auth/helper";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export type PageProps = {};

export const metadata: Metadata = {
  title: "Activity",
};

export default async function Page(props: PageProps) {
  const user = await auth();

  if (!user) redirect("/admin");

  return (
    <div className="w-[500px] mx-auto">
      <div className="py-4 border-b">
        <h2 className="h2">Activity</h2>
      </div>
      <NotificationsList user={user} />
    </div>
  );
}
