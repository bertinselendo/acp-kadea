"use client";

import { BarList } from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getCurrentUserProjects } from "../projects/project.action";
import { User } from "@prisma/client";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileCheck,
  FileText,
  MessageSquareText,
  SquareAsterisk,
  SquareGantt,
} from "lucide-react";
import { getUserAllDatas } from "@app/(main)/account/account.action";

export function UserStats({ user }: { user: User }) {
  const [projectsNumber, setProjectsNumber] = useState(null);
  const [feedbacksNumber, setFeedbacksNumber] = useState(null);
  const [documentsNumber, setDocumentsNumber] = useState(null);
  const [invoicesNumber, setInvoicesNumber] = useState(null);
  const [credentialsNumber, setCredentialsNumber] = useState(null);

  useQuery({
    queryKey: ["all-user-datas"],
    queryFn: async () => {
      const projects = await getCurrentUserProjects();
      const userDatas = await getUserAllDatas(user.id);

      setProjectsNumber(projects.length);
      setFeedbacksNumber(userDatas.feedbacks.length);
      setDocumentsNumber(userDatas.documents.length);
      setInvoicesNumber(userDatas.invoices.length);
      setCredentialsNumber(userDatas.credentials.length);

      return projects;
    },
  });

  if (!projectsNumber) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-[80%]" />
        <Skeleton className="h-8 w-[60%]" />
      </div>
    );
  }

  const datahero = [
    {
      name: "Projects",
      value: projectsNumber ?? 0,
      color: "primary",
      icon: function TwitterIcon() {
        return <SquareGantt className="w-5 h-5 mr-1 mt-[1px]" />;
      },
    },
    {
      name: "Feedbacks",
      value: feedbacksNumber ?? 0,
      color: "light-orange",
      icon: function TwitterIcon() {
        return <MessageSquareText className="w-5 h-5 mr-1 mt-[1px]" />;
      },
    },
    {
      name: "Documents",
      value: documentsNumber ?? 0,
      color: "light-green",
      icon: function TwitterIcon() {
        return <FileText className="w-5 h-5 mr-1 mt-[1px]" />;
      },
    },
    {
      name: "Invoices",
      value: invoicesNumber ?? 0,
      color: "light-blue",
      icon: function TwitterIcon() {
        return <FileCheck className="w-5 h-5 mr-1 mt-[1px]" />;
      },
    },
    {
      name: "Credentials",
      value: credentialsNumber ?? 0,
      color: "light-red",
      icon: function TwitterIcon() {
        return <SquareAsterisk className="w-5 h-5 mr-1 mt-[1px]" />;
      },
    },
  ];

  return (
    <>
      <h3 className="text-tremor-title text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">
        Global Analytics
      </h3>
      <BarList data={datahero} showAnimation={true} className="mx-auto mt-4" />
    </>
  );
}
