"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export type PricingTierFrequency = {
  id: string;
  value: string;
  label: string;
  priceSuffix: string;
};

export type PricingTier = {
  name: string;
  id: string;
  href: string;
  discountPrice: string | Record<string, string>;
  price: string | Record<string, string>;
  description: string | React.ReactNode;
  features: string[];
  featured?: boolean;
  highlighted?: boolean;
  cta: string;
  soldOut?: boolean;
};

export const frequencies: PricingTierFrequency[] = [
  { id: "1", value: "1", label: "Monthly", priceSuffix: "/month" },
  { id: "2", value: "2", label: "Annually", priceSuffix: "/year" },
];

export const tiers: PricingTier[] = [
  {
    name: "Essential",
    id: "0",
    href: "/auth/onboarding?step=welcome",
    price: { "1": "$0", "2": "$0" },
    discountPrice: { "1": "", "2": "" },
    description: `Get all goodies for free, no credit card required.`,
    features: [
      `Unlimited customer`,
      `Unlimited team member`,
      `Unlimited project`,
      `Internal feedback feature`,
    ],
    featured: false,
    highlighted: false,
    soldOut: false,
    cta: `Select`,
  },
  {
    name: "Pro",
    id: "1",
    href: "#",
    price: { "1": "$29", "2": "$348" },
    discountPrice: { "1": "", "2": "$299" },
    description: `When you grow, need more power and flexibility.`,
    features: [
      `Unlimited customer`,
      `Unlimited team member`,
      `Unlimited project`,
      `Internal feedback feature`,
    ],
    featured: false,
    highlighted: true,
    soldOut: false,
    cta: `Get started`,
  },
];

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default function PricingTable() {
  const [frequency, setFrequency] = useState(frequencies[0]);

  return (
    <div className={cn("flex flex-col w-full items-center")}>
      <div className="w-full flex flex-col items-center">
        <div className="flex flex-col items-center">
          {frequencies.length > 1 ? (
            <div className="mt-0 flex justify-center">
              <RadioGroup
                defaultValue={frequency.value}
                onValueChange={(value: string) => {
                  setFrequency(frequencies.find((f) => f.value === value)!);
                }}
                className="grid gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 bg-background ring-1 ring-inset ring-gray-200/30 dark:ring-gray-800"
                style={{
                  gridTemplateColumns: `repeat(${frequencies.length}, minmax(0, 1fr))`,
                }}
              >
                <Label className="sr-only">Payment frequency</Label>
                {frequencies.map((option) => (
                  <Label
                    className={cn(
                      frequency.value === option.value
                        ? "bg-primary"
                        : "bg-transparent text-gray-500 hover:bg-secondary",
                      "cursor-pointer rounded-full px-2.5 py-2 transition-all"
                    )}
                    key={option.value}
                    htmlFor={option.value}
                  >
                    {option.label}

                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="hidden"
                    />
                  </Label>
                ))}
              </RadioGroup>
            </div>
          ) : (
            <div className="mt-0" aria-hidden="true"></div>
          )}

          <div
            className={cn(
              "isolate mx-auto mt-4 grid max-w-md grid-cols-1 gap-4 lg:mx-0 lg:max-w-none",
              tiers.length === 2 ? "lg:grid-cols-2" : "",
              tiers.length === 3 ? "lg:grid-cols-3" : ""
            )}
          >
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  tier.featured
                    ? "!bg-gray-900 ring-gray-900 dark:!bg-gray-100 dark:ring-gray-100"
                    : "bg-white dark:bg-gray-900/80 ring-secondary dark:ring-gray-700",
                  "max-w-xs ring-1 rounded-lg p-4 xl:p-4",
                  tier.highlighted ? "bg-primary ring-primary" : ""
                )}
              >
                <h3
                  id={tier.id}
                  className={cn(
                    tier.featured
                      ? "text-white dark:text-black"
                      : "text-black dark:text-white",
                    "text-2xl font-bold tracking-tight"
                  )}
                >
                  {tier.name}
                </h3>
                <p
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-600 dark:text-gray-400",
                    "mt-2 text-sm leading-2"
                  )}
                >
                  {tier.description}
                </p>
                <p className="mt-2 flex items-baseline gap-x-1">
                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white",
                      "text-4xl font-bold tracking-tight",
                      tier.discountPrice && tier.discountPrice[frequency.value]
                        ? "line-through"
                        : ""
                    )}
                  >
                    {typeof tier.price === "string"
                      ? tier.price
                      : tier.price[frequency.value]}
                  </span>

                  <span
                    className={cn(
                      tier.featured
                        ? "text-white dark:text-black"
                        : "text-black dark:text-white"
                    )}
                  >
                    {typeof tier.discountPrice === "string"
                      ? tier.discountPrice
                      : tier.discountPrice[frequency.value]}
                  </span>

                  {typeof tier.price !== "string" ? (
                    <span
                      className={cn(
                        tier.featured
                          ? "text-gray-300 dark:text-gray-500"
                          : "dark:text-gray-400 text-gray-600",
                        "text-sm font-semibold leading-6"
                      )}
                    >
                      {frequency.priceSuffix}
                    </span>
                  ) : null}
                </p>
                <a
                  href={tier.href}
                  aria-describedby={tier.id}
                  className={cn(
                    "flex mt-4 shadow-sm",
                    tier.soldOut ? "pointer-events-none" : ""
                  )}
                >
                  <Button
                    size="lg"
                    disabled={tier.soldOut}
                    className={cn(
                      "w-full text-black dark:text-white",
                      !tier.highlighted && !tier.featured
                        ? "bg-white dark:bg-gray-600"
                        : "bg-white hover:bg-white/95 dark:bg-slate-600 dark:hover:bg-slate-700",
                      tier.featured || tier.soldOut
                        ? "bg-white dark:bg-neutral-900 hover:bg-white/95 dark:hover:bg-black"
                        : "hover:opacity-95 transition-opacity"
                    )}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.soldOut ? "Sold out" : tier.cta}
                  </Button>
                </a>

                <ul
                  className={cn(
                    tier.featured
                      ? "text-gray-300 dark:text-gray-500"
                      : "text-gray-700 dark:text-gray-400",
                    "mt-4 space-y-2 text-sm xl:mt-4"
                  )}
                >
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-2">
                      <CheckIcon
                        className={cn(
                          tier.featured ? "text-white dark:text-black" : "",
                          tier.highlighted
                            ? "text-green-600"
                            : "text-green-600",

                          "h-5 w-5 flex-none -mt-[1px]"
                        )}
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
