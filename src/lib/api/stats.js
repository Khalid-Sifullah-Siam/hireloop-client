import { db } from "@/lib/database-helpers";

export async function getPlatformStats() {
  const [activeJobs, companies, jobSeekers, applications] = await Promise.all([
    db.collection("jobs").countDocuments({
      status: { $regex: /^(approved|active)$/i },
    }),
    db.collection("companies").countDocuments({
      status: { $regex: /^(approved|active)$/i },
    }),
    db.collection("user").countDocuments({ role: "seeker" }),
    db.collection("applications").countDocuments(),
  ]);

  return [
    { value: String(activeJobs), label: "Active Jobs" },
    { value: String(companies), label: "Companies" },
    { value: String(jobSeekers), label: "Job Seekers" },
    { value: String(applications), label: "Applications" },
  ];
}
