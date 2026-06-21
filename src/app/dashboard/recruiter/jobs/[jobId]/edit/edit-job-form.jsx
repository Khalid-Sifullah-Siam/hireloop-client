"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { updateRecruiterJob } from "@/lib/actions/recruiter-jobs";

const inputClass = "mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none";
const textareaClass = "mt-2 min-h-[148px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none";

export default function EditJobForm({ job }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const payload = Object.fromEntries(formData.entries());

      await updateRecruiterJob(job._id, {
        ...payload,
        companyId: job.companyId || job.company?.id,
        companyPlan: job.companyPlan,
        isRemote: payload.isRemote === "on",
        status: "pending",
      });

      toast.success("Job updated successfully. It is now pending admin approval.");
      router.push("/dashboard/recruiter/jobs");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 text-white">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Job</h1>
        <Link href="/dashboard/recruiter/jobs" className="text-sm text-cyan-300">Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-[#111114] p-6 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="text-sm">Job Title</span>
          <input name="jobTitle" defaultValue={job.title} className={inputClass} />
        </label>
        <label>
          <span className="text-sm">Category</span>
          <input name="category" defaultValue={job.category} className={inputClass} />
        </label>
        <label>
          <span className="text-sm">Job Type</span>
          <input name="jobType" defaultValue={job.jobType} className={inputClass} />
        </label>
        <label>
          <span className="text-sm">Minimum Salary</span>
          <input name="minSalary" defaultValue={job.minSalary ?? ""} className={inputClass} />
        </label>
        <label>
          <span className="text-sm">Maximum Salary</span>
          <input name="maxSalary" defaultValue={job.maxSalary ?? ""} className={inputClass} />
        </label>
        <label>
          <span className="text-sm">Location</span>
          <input name="location" defaultValue={job.location} className={inputClass} />
        </label>
        <label>
          <span className="text-sm">Deadline</span>
          <input name="deadline" type="date" defaultValue={job.deadline?.slice?.(0, 10) || ""} className={inputClass} />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm">Responsibilities</span>
          <textarea name="responsibilities" defaultValue={job.responsibilities} className={textareaClass} />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm">Requirements</span>
          <textarea name="requirements" defaultValue={job.requirements} className={textareaClass} />
        </label>
        <label className="md:col-span-2">
          <span className="text-sm">Benefits</span>
          <textarea name="benefits" defaultValue={job.benefits} className={textareaClass} />
        </label>
        <div className="md:col-span-2 flex justify-end gap-3">
          <Link href="/dashboard/recruiter/jobs" className="rounded-xl border border-white/10 px-5 py-3 text-sm">Cancel</Link>
          <button disabled={isSubmitting} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900">
            {isSubmitting ? "Updating..." : "Update Job"}
          </button>
        </div>
      </form>
    </div>
  );
}
