"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateAdminJobStatus } from "@/lib/actions/admin-jobs";

export default function AdminJobAction({ jobId, status }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isApprove = status === "approved";

  const handleClick = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("jobId", jobId);
      formData.append("status", status);

      const result = await updateAdminJobStatus(formData);
      const jobTitle = result?.job?.title || "job";

      toast.success(
        isApprove
          ? `You approved ${jobTitle}.`
          : `You rejected ${jobTitle}.`
      );

      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update job status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isSubmitting}
      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
        isApprove
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
          : "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
      } ${isSubmitting ? "cursor-not-allowed opacity-70" : ""}`}
    >
      {isSubmitting ? "Updating..." : isApprove ? "Approve" : "Reject"}
    </button>
  );
}
