import ListFeedbacks from "@/components/admin/feedbacks/listFeeddbacks";
import { auth } from "@/lib/auth/helper";
import { getServerUrl } from "@/lib/server-url";
import { redirect } from "next/navigation";

export type PageProps = {};

export default async function Page({ params }: any) {
  const user = await auth();

  if (!user)
    redirect(
      `/login?callbackUrl=${getServerUrl()}/p/${params?.projectID}/feedbacks`,
    );

  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-full p-4 md:p-0 xl:w-[600px]">
      <div className="text-xl font-bold">Feedbacks</div>
      <div>
        <ListFeedbacks projectID={params.projectID} />
      </div>
    </div>
  );
}
