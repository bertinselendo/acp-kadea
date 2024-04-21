"use client";

import { hasOrganization, isAdmin } from "@/lib/auth/auth-utils";
import OnboardOrganizationStepForm from "./organization-step-form";
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export default function OrganizationStep({ user }: { user: User }) {
  if (!user) {
    redirect("/auth/onboarding?step=user");
  }

  if (hasOrganization(user)) {
    redirect("/auth/onboarding?step=subscription");
  }

  return (
    <>
      <h2 className="h2">Add your company</h2>
      <p className="text-sm mb-4">
        Create your company profile in less than 5 minutes
      </p>
      <OnboardOrganizationStepForm />
    </>
  );
}
