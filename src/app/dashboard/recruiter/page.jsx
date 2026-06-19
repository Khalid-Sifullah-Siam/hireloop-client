import DashboardStats from "@/Components/Dashboard/DashboardStats";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const recruiterStats = [
  { title: "Total Job Posts", value: "48", iconName: "fileText" },
  { title: "Total Applicants", value: "1,284", iconName: "users" },
  { title: "Active Jobs", value: "18", iconName: "zap" },
  { title: "Jobs Closed", value: "32", iconName: "checkCircle" },
];

export default async function RecruiterDashboardHomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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
