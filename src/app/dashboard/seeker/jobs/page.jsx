import { getAllJobs } from "@/lib/api/jobs";
import JobsClient from "@/app/jobs/jobs-client";

export default async function SeekerJobsPage() {
  const jobs = await getAllJobs();

  return <JobsClient jobs={jobs} />;
}
