"use client";

import PricingTable from "@/components/pricing/pricing-table";
import { User } from "@prisma/client";

export default function SubscriptionStep({ user }: { user: User }) {
  return (
    <>
      <h2 className="h2">Add a subscription</h2>
      <p className="text-sm mb-4">
        Create your company profile in less than 5 minutes
      </p>
      <PricingTable />
    </>
  );
}
