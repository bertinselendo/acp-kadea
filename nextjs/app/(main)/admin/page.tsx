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
    <div className="mb-80 p-3 *:px-2 md:mb-0 *:md:px-12 *:xl:px-24">
      <div className="w-full pt-2 md:pt-6">
        <h2 className="text-2xl font-bold md:text-4xl">
          Welcome back {nameGreet} 👋🏼
        </h2>
        <p>It&apos;s {dateGreet}</p>
      </div>
      <div className="w-full border-b py-6">
        <AdminHomeCarousel user={user} />
      </div>
      <div className="grid w-full grid-cols-1 gap-4 py-6 *:h-72 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <UserStats user={user} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 grid-rows-none gap-4 md:mb-0 md:grid-cols-2 md:grid-rows-2">
          <ActivityStats user={user} />
        </div>
      </div>
    </div>
  );
}
