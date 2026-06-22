"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { deleteRecruiterJob, updateApplicationStatus, updateRecruiterJob } from "@/lib/actions/recruiter-jobs";

const inputClass = "mt-1 h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-400";
const textareaClass = "mt-1 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400";

export default function JobActions({ job, applications = [] }) {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isApplicationsOpen, setIsApplicationsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [statusChange, setStatusChange] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const jobTitle = job?.title || "job";

  const getApplicantName = (application) => {
    return application.applicationInfo.fullName || application.userInfo.name || "N/A";
  };

  const getApplicationActions = (application) => {
    const status = String(application.status || "").toLowerCase();

    if (status === "interview") {
      return [
        { label: "Hired", status: "hired", className: "border-emerald-200 text-emerald-700 hover:bg-emerald-50" },
        { label: "Reject", status: "rejected", className: "border-red-200 text-red-600 hover:bg-red-50" },
      ];
    }

    if (status === "applied" || status === "submitted" || status === "review") {
      return [
        { label: "Interview", status: "interview", className: "border-blue-200 text-blue-700 hover:bg-blue-50" },
        { label: "Reject", status: "rejected", className: "border-red-200 text-red-600 hover:bg-red-50" },
      ];
    }

    return [];
  };

  const openStatusConfirm = (application, nextStatus) => {
    setStatusChange({
      applicationId: application._id,
      applicantName: getApplicantName(application),
      nextStatus,
    });
  };

  const handleStatusChange = async () => {
    if (!statusChange) {
      return;
    }

    setIsStatusUpdating(true);

    try {
      await updateApplicationStatus(statusChange.applicationId, statusChange.nextStatus);
      toast.success(`Application marked as ${statusChange.nextStatus}.`);
      setStatusChange(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update application.");
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const getStatusDialogText = () => {
    if (!statusChange) {
      return {
        title: "",
        message: "",
        buttonText: "Confirm",
      };
    }

    if (statusChange.nextStatus === "interview") {
      return {
        title: "Invite to interview?",
        message: `Do you want to approve ${statusChange.applicantName} for the interview round?`,
        buttonText: "Approve interview",
      };
    }

    if (statusChange.nextStatus === "hired") {
      return {
        title: "Mark as hired?",
        message: `Do you want to mark ${statusChange.applicantName} as hired for this job?`,
        buttonText: "Mark hired",
      };
    }

    return {
      title: "Reject application?",
      message: `Do you want to reject ${statusChange.applicantName}'s application for this job?`,
      buttonText: "Reject application",
    };
  };

  const statusDialogText = getStatusDialogText();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteRecruiterJob(job._id);
      toast.success(`"${jobTitle}" deleted successfully.`);
      setIsDeleteOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete job.");
    } finally {
      setIsDeleting(false);
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
          onClick={() => setIsApplicationsOpen(true)}
          className="rounded-md border border-emerald-200 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"
        >
          Applications ({applications.length})
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      {isDeleteOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-job-title"
            aria-describedby="delete-job-message"
            className="w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-2xl"
          >
            <h2 id="delete-job-title" className="text-xl font-semibold">
              Delete job?
            </h2>
            <p id="delete-job-message" className="mt-3 text-sm leading-6 text-slate-600">
              Are you sure you want to delete &quot;{jobTitle}&quot;? This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {isApplicationsOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-6 text-slate-900 shadow-2xl">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Applications</h2>
                <p className="mt-1 text-sm text-slate-600">
                  {applications.length} application{applications.length === 1 ? "" : "s"} for &quot;{jobTitle}&quot;.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsApplicationsOpen(false)}
                className="rounded-md border px-3 py-1 text-sm"
              >
                Close
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center">
                <p className="text-sm text-slate-600">No applications for this job yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Applied</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Resume</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => {
                      const actions = getApplicationActions(application);

                      return (
                        <tr key={application._id} className="border-t">
                          <td className="p-3 font-medium text-slate-900">
                            {getApplicantName(application)}
                          </td>
                          <td className="p-3 text-slate-600">
                            {application.applicationInfo.email || application.userInfo.email || "N/A"}
                          </td>
                          <td className="p-3 text-slate-600">
                            {application.appliedAtText}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                              {application.status}
                            </span>
                          </td>
                          <td className="p-3">
                            {application.applicationInfo.resumeLink ? (
                              <a
                                href={application.applicationInfo.resumeLink}
                                target="_blank"
                                rel="noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-slate-500">N/A</span>
                            )}
                          </td>
                          <td className="p-3">
                            {actions.length === 0 ? (
                              <span className="text-xs text-slate-500">Completed</span>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {actions.map((action) => (
                                  <button
                                    key={action.status}
                                    type="button"
                                    onClick={() => openStatusConfirm(application, action.status)}
                                    className={`rounded-md border px-3 py-1.5 text-xs font-semibold ${action.className}`}
                                  >
                                    {action.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {statusChange ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="application-status-title"
            aria-describedby="application-status-message"
            className="w-full max-w-md rounded-xl bg-white p-6 text-slate-900 shadow-2xl"
          >
            <h2 id="application-status-title" className="text-xl font-semibold">
              {statusDialogText.title}
            </h2>
            <p id="application-status-message" className="mt-3 text-sm leading-6 text-slate-600">
              {statusDialogText.message}
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStatusChange(null)}
                disabled={isStatusUpdating}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStatusChange}
                disabled={isStatusUpdating}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isStatusUpdating ? "Updating..." : statusDialogText.buttonText}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
