"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteRecruiterJob, updateRecruiterJob } from "@/lib/actions/recruiter-jobs";

const inputClass = "mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400";
const textareaClass = "mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400";

export default function JobActions({ job }) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const jobTitle = job?.title || "job";

  const handleDelete = async () => {
    const ok = window.confirm(`Delete "${jobTitle}"?`);
    if (!ok) return;

    try {
      await deleteRecruiterJob(job._id);
      toast.success(`"${jobTitle}" deleted successfully.`);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete job.");
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const payload = Object.fromEntries(formData.entries());

      await updateRecruiterJob(job._id, {
        ...payload,
        companyId: job.companyId,
        companyPlan: job.companyPlan,
        isRemote: payload.isRemote === "on",
        status: "pending",
      });

      toast.success(`"${payload.jobTitle}" updated and sent for admin approval.`);
      setIsEditOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsEditOpen(true)}
          className="rounded-md border border-blue-200 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {isEditOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Edit job</h2>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleEdit} className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="text-sm font-medium">Job title</span>
                <input name="jobTitle" defaultValue={job.title} required className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Category</span>
                <input name="category" defaultValue={job.category} required className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Job type</span>
                <input name="jobType" defaultValue={job.jobType} required className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Minimum salary</span>
                <input name="minSalary" type="number" defaultValue={job.minSalary} required className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Maximum salary</span>
                <input name="maxSalary" type="number" defaultValue={job.maxSalary} required className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Currency</span>
                <input name="currency" defaultValue={job.currency || "USD"} required className={inputClass} />
              </label>
              <label>
                <span className="text-sm font-medium">Location</span>
                <input name="location" defaultValue={job.location} className={inputClass} />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-medium">Deadline</span>
                <input name="deadline" type="date" defaultValue={String(job.deadline || "").slice(0, 10)} required className={inputClass} />
              </label>
              <label className="md:col-span-2 flex items-center gap-2">
                <input name="isRemote" type="checkbox" defaultChecked={job.isRemote} />
                <span className="text-sm font-medium">Remote job</span>
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-medium">Responsibilities</span>
                <textarea name="responsibilities" defaultValue={job.responsibilities} required className={textareaClass} />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-medium">Requirements</span>
                <textarea name="requirements" defaultValue={job.requirements} required className={textareaClass} />
              </label>
              <label className="md:col-span-2">
                <span className="text-sm font-medium">Benefits</span>
                <textarea name="benefits" defaultValue={job.benefits} className={textareaClass} />
              </label>

              <p className="md:col-span-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700">
                After editing, this job status will become pending again.
              </p>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditOpen(false)} className="rounded-lg border px-4 py-2 text-sm">
                  Cancel
                </button>
                <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                  {isSubmitting ? "Updating..." : "Update job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
