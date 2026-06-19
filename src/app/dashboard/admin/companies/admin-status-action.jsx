"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateAdminCompanyStatus } from "@/lib/actions/admin-companies";

export default function AdminStatusAction({ companyId, status }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isApprove = status === "approved";

  const handleClick = async () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("companyId", companyId);
      formData.append("status", status);

      const result = await updateAdminCompanyStatus(formData);
      const companyName = result?.company?.name || "company";

      toast.success(
        isApprove
          ? `You approved ${companyName}.`
          : `You rejected ${companyName}.`
      );

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update company status."
      );
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
