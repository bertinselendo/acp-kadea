import { getClientSingleProject } from "@/components/admin/projects/project.action";
import { Skeleton } from "@/components/ui/skeleton";
import { PageParams } from "@/types/next";
import type { Metadata, ResolvingMetadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ProjectHeader from "@/components/admin/projects/single/projectHeader";
import { Project } from "@prisma/client";
import DashFeedbacks from "@/components/admin/projects/single/dashboard/feedbacks";
import AddFeedbackModal from "@/components/admin/feedbacks/addFeedbackModal";
import DashCredentials from "@/components/admin/projects/single/dashboard/credentials";
import AddcredentialsModal from "@/components/admin/credentials/addcredentialsModal";
import DashDocuments from "@/components/admin/projects/single/dashboard/documents";
import AddDocumentModal from "@/components/admin/documents/addDocumentModal";
import { notFound, redirect } from "next/navigation";
import AddInvoiceModal from "@/components/admin/invoices/addInvoicesModal";
import DashInvoices from "@/components/admin/projects/single/dashboard/invoices";
import { auth } from "@/lib/auth/helper";
import { getServerUrl } from "@/lib/server-url";

type Props = {
  params: { projectID: string };
};

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default async function ProjectSinglePage({ params }: Props) {
  const user = await auth();

  if (!user)
    redirect(`/login?callbackUrl=${getServerUrl()}/p/${params?.projectID}`);

  const project = await getClientSingleProject(params.projectID);

  if (!project) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col gap-6 p-4">
      <ProjectHeader project={project as Project} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="h-80">
          <CardContent className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <CardTitle>Feedbacks</CardTitle>
              <AddFeedbackModal projectID={params.projectID} variant="icon" />
            </div>
            <DashFeedbacks projectID={params.projectID} />
          </CardContent>
        </Card>
        <Card className="h-80">
          <CardContent className="flex h-full w-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <CardTitle>Documents</CardTitle>
              <AddDocumentModal projectID={params.projectID} variant="icon" />
            </div>
            <DashDocuments projectID={params.projectID} />
          </CardContent>
        </Card>
        <Card className="h-72 md:h-80 xl:h-72 2xl:h-80">
          <CardContent className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <AddInvoiceModal projectID={params.projectID} variant="icon" />
            </div>
            <DashInvoices projectID={params.projectID} />
          </CardContent>
        </Card>
        <Card className="h-80">
          <CardContent className="flex h-full flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <CardTitle>Credentials</CardTitle>
              <AddcredentialsModal
                projectID={params.projectID}
                variant="icon"
              />
            </div>

            <DashCredentials projectID={params.projectID} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
