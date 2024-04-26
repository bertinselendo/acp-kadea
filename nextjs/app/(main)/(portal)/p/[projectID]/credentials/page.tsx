import ListCredentials from "@/components/admin/credentials/listCredentials";
import ListFeedbacks from "@/components/admin/feedbacks/listFeeddbacks";
import { auth } from "@/lib/auth/helper";
import { getServerUrl } from "@/lib/server-url";
import { redirect } from "next/navigation";

export type PageProps = {};

export default async function Page({ params }: any) {
  const user = await auth();

  if (!user)
    redirect(
      `/login?callbackUrl=${getServerUrl()}/p/${params?.projectID}/credentials`,
    );

  if (!params.projectID) {
    return;
  }
  return (
    <div className="w-full p-4 md:w-[500px] md:p-0 xl:w-[600px]">
      <div className="text-xl font-bold">Credentials</div>
      <div>
        <ListCredentials projectID={params.projectID} />
      </div>
    </div>
  );
}
