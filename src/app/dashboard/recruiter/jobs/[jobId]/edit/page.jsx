import { getJobById } from "@/lib/api/jobs";
import EditJobForm from "./edit-job-form";
import { notFound } from "next/navigation";

export default async function EditRecruiterJobPage({ params }) {
  const { jobId } = await params;
  const job = await getJobById(jobId);

  if (!job) {
    notFound();
  }

  return <EditJobForm job={job} />;
}
