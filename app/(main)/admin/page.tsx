import UserAvatar from "@/components/auth/UserAvatar";
import { auth } from "@/lib/auth/helper";
import { PageParams } from "@/types/next";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminHomeCarousel } from "@/components/admin/home/projectCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import { UserStats } from "@/components/admin/home/userStats";
import { ActivityStats } from "@/components/admin/home/activityStats";

export const metadata: Metadata = {
  title: "Home",
};

export default async function AdminHomePage(props: PageParams) {
  const user = await auth();
  if (!user) {
    redirect("/login");
  }

  const nameGreet = user.firstName ?? "";
  const dateGreet = dayjs().format("MMMM, DD YYYY - HH:mm").toString();

  return (
    <div className="p-3">
      <div className="w-full px-24 pt-6">
        <h2 className="text-4xl font-bold">Welcome back {nameGreet} 👋🏼</h2>
        <p>It&apos;s {dateGreet}</p>
      </div>
      <div className="w-full px-24 border-b py-6">
        <AdminHomeCarousel user={user} />
      </div>
      <div className="py-6 px-24 w-full grid grid-cols-2 gap-4 *:h-72">
        <Card>
          <CardContent className="p-6">
            <UserStats user={user} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <ActivityStats user={user} />
        </div>
      </div>
    </div>
  );
}
