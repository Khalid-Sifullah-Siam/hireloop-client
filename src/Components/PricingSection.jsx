'use client';

import { useState } from "react";
import { Button, Card, Switch } from "@heroui/react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
  },
  {
    name: "Growth",
    price: "$17",
    features: [
      "Daily AI match brief (top 5)",
      "Verified salary bands",
      "Company insight dashboards",
      "1-click apply, unlimited",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "$99",
    features: [
      "Everything in Growth",
      "Multi-profile career portfolios",
      "Shared talent rooms",
      "Recruiter view (read-only)",
    ],
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="bg-[#0f0f0f] px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-purple-500">
          Pricing
        </p>
        <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl">
          Pay for the leverage, not the listings
        </h2>

        <div className="mb-12 flex items-center justify-center gap-4">
          <span className={!isYearly ? "text-white" : "text-gray-500"}>
            Monthly
          </span>
          <Switch
            color="secondary"
            isSelected={isYearly}
            onValueChange={setIsYearly}
          />
          <span className={isYearly ? "text-white" : "text-gray-500"}>
            Yearly
            <span className="ml-1 rounded-full bg-purple-600 px-2 py-1 text-xs text-white">
              25%
            </span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border bg-[#1a1a1a] p-6 ${
                plan.highlight ? "border-purple-500" : "border-gray-800"
              }`}
            >
              <div className="text-left">
                <h3 className="mb-2 font-medium text-gray-400">{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>

                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-gray-300"
                    >
                      <span className="text-purple-500">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.highlight ? "bg-white text-black" : "bg-[#2a2a2a] text-white"
                  }`}
                  radius="sm"
                >
                  Choose This Plan -&gt;
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
