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
    <div className="mx-auto w-full px-4 pb-20 md:w-[500px] md:px-0">
      <div className="border-b py-4 md:px-0">
        <h2 className="h2">Activity</h2>
      </div>
      <NotificationsList user={user} />
    </div>
  );
}
