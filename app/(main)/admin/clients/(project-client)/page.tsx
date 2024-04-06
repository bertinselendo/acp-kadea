import LottieRobot from "@/components/lotties/lottie-robot";
import { isClient } from "@/lib/auth/auth-utils";
import { auth } from "@/lib/auth/helper";
import { PageParams } from "@/types/next";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Clients",
};

export default async function ClientPage(props: PageParams) {
  const user = await auth();
  if (!user) redirect("/admin");
  console.log(isClient(user));

  if (isClient(user)) notFound();

  return (
    <div className="flex flex-col items-center justify-center p-20">
      {/* <LottieRobot /> */}
      <p className="text-2xl">😏</p>
      <h2 className="text-sm">Select a client to view projects</h2>
    </div>
  );
}
