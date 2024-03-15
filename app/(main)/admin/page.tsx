import UserAvatar from "@/components/auth/UserAvatar";
import { auth } from "@/lib/auth/helper";
import { PageParams } from "@/types/next";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

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
      <UserAvatar src={user.avatar} />
      <p>Bonjour {user.firstName}</p>
    </div>
  );
}
