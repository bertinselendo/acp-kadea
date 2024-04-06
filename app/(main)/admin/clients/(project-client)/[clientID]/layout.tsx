import { getClientUsers } from "@/components/admin/clients/clients.action";
import { auth } from "@/lib/auth/helper";
import { notFound, redirect } from "next/navigation";

type propsType = {
  children: ChildNode;
  params: { clientID: string };
};

export default async function Layout({ children, params }: propsType) {
  if (!params.clientID) redirect("/admin");

  const currentUser = await auth();

  const users = await getClientUsers(params.clientID);
  const user = users?.filter((user) => user.id == currentUser?.id);

  if (currentUser?.role == "CLIENT" && user?.length == 0) notFound();

  return children;
}
