import UserAvatar from "@/components/auth/UserAvatar";
import { auth } from "@/lib/auth/helper";
import { PageParams } from "@/types/next";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdminHomeCarousel } from "@/components/admin/home/projectCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Home",
};

export default async function AdminHomePage(props: PageParams) {
  const user = await auth();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="w-full px-24 border-b pb-4">
        <AdminHomeCarousel />
      </div>
      <div className="py-6 px-20 flex flex-wrap gap-6 justify-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-[48%]">
            <Card>
              <CardContent className="flex items-center justify-center p-6 h-80">
                <span className="text-2xl font-semibold">{index + 1}</span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
