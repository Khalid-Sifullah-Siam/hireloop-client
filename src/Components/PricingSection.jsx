"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Card } from "@heroui/react";

const jobSeekerPlans = [
  {
    name: "Free",
    id: "seeker_free",
    price: "$0",
    time: "forever",
    features: [
      "Browse & save up to 10 jobs",
      "Apply to up to 3 jobs per month",
      "Basic profile",
      "Email alerts",
    ],
  },
  {
    name: "Pro",
    id: "seeker_pro",
    price: "$19",
    time: "month",
    features: [
      "Apply to up to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    id: "seeker_premium",
    price: "$39",
    time: "month",
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
  },
];

const recruiterPlans = [
  {
    name: "Free",
    id: "recruiter_free",
    price: "$0",
    time: "forever",
    features: [
      "Up to 3 active job posts, basic applicant management, standard listing visibility (great for a company's first year of hiring)",
    ],
  },
  {
    name: "Growth",
    id: "recruiter_growth",
    price: "$49",
    time: "month",
    features: [
      "Up to 10 active job posts, applicant tracking, basic analytics, email support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    id: "recruiter_enterprise",
    price: "$149",
    time: "month",
    features: [
      "Up to 50 active job posts, advanced analytics dashboard, featured job listings, team collaboration, custom branding, priority support",
    ],
  },
];

export default function PricingSection({ currentUser = null }) {
  const [activePlanType, setActivePlanType] = useState("jobSeeker");
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "";

  const plans =
    activePlanType === "jobSeeker" ? jobSeekerPlans : recruiterPlans;

  const sectionTitle =
    activePlanType === "jobSeeker" ? "For Job Seekers" : "For Recruiters";

  return (
    <section className="bg-[#0f0f0f] px-6 py-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-purple-500">
          Pricing
        </p>
        <h2 className="mb-8 text-4xl font-bold text-white md:text-5xl">
          Pricing Plans
        </h2>

        <div className="mx-auto mb-10 flex max-w-md rounded-lg border border-gray-800 bg-[#1a1a1a] p-1">
          <button
            type="button"
            onClick={() => setActivePlanType("jobSeeker")}
            className={`w-1/2 rounded-md px-4 py-3 text-sm font-semibold ${
              activePlanType === "jobSeeker"
                ? "bg-white text-black"
                : "text-gray-400"
            }`}
          >
            Job Seekers
          </button>
          <button
            type="button"
            onClick={() => setActivePlanType("recruiter")}
            className={`w-1/2 rounded-md px-4 py-3 text-sm font-semibold ${
              activePlanType === "recruiter"
                ? "bg-white text-black"
                : "text-gray-400"
            }`}
          >
            Recruiters
          </button>
        </div>

        <h3 className="mb-8 text-2xl font-bold text-white">{sectionTitle}</h3>

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
                  <span className="text-gray-500">/{plan.time}</span>
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

                {plan.price === "$0" || !currentUser ? (
                  <Link
                    href={currentUser ? "/jobs" : "/auth/signin"}
                    className={`inline-flex w-full items-center justify-center rounded-md px-4 py-3 text-sm font-semibold ${
                      plan.highlight
                        ? "bg-white text-black"
                        : "bg-[#2a2a2a] text-white"
                    }`}
                  >
                    {plan.price === "$0" ? "Start Free" : "Sign in to checkout"}
                  </Link>
                ) : (
                  <form action={`${serverUrl}/checkout_sessions`} method="POST">
                    <section>
                      <input
                        type="hidden"
                        name="planId"
                        value={plan.id}
                      />
                      <input type="hidden" name="userId" value={currentUser.id} />
                      <input type="hidden" name="userEmail" value={currentUser.email} />
                      <input type="hidden" name="userRole" value={currentUser.role || ""} />
                      <Button
                        className={`w-full ${
                          plan.highlight
                            ? "bg-white text-black"
                            : "bg-[#2a2a2a] text-white"
                        }`}
                        radius="sm"
                        type="submit"
                        role="link"
                      >
                        Checkout This Plan -&gt;
                      </Button>
                    </section>
                  </form>
                )}

             
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
