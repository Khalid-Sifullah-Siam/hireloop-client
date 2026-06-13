'use client';

import DashboardStats from "@/Components/Dashboard/DashboardStats";
import { authClient } from "@/lib/auth-client";
import { CheckCircle, FileText, Users, Zap } from "lucide-react";

const recruiterStats = [
  { title: "Total Job Posts", value: "48", icon: FileText },
  { title: "Total Applicants", value: "1,284", icon: Users },
  { title: "Active Jobs", value: "18", icon: Zap },
  { title: "Jobs Closed", value: "32", icon: CheckCircle },
];

export default function RecruiterDashboardHomePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  const user = session?.user;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome back, {user?.name || "Recruiter"}
      </h1>
      <DashboardStats stats={recruiterStats} />
    </div>
  );
}
