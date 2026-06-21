"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { updateAdminUser } from "@/lib/actions/admin-users";

const roles = ["admin", "seeker", "recruiter"];

export default function AdminUserActions({ userId, userName, role, status, suspended }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayName = userName || "user";

  async function runAction(action, value, successMessage) {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("action", action);
      formData.append("value", value);

      await updateAdminUser(formData);
      toast.success(successMessage);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleRoleChange(event) {
    const nextRole = event.target.value;

    if (!nextRole || nextRole === role) {
      return;
    }

    runAction("role", nextRole, `${displayName} is now ${nextRole}.`);
  }

  return (
    <div className="flex flex-wrap items-center justify-start gap-2 lg:justify-end">
      {status === "pending" && (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => runAction("status", "active", `${displayName} is now active.`)}
          className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Approve
        </button>
      )}

      <select
        value={role}
        onChange={handleRoleChange}
        disabled={isSubmitting}
        className="rounded-lg border border-white/10 bg-[#121214] px-3 py-1.5 text-xs font-medium text-white/75 outline-none transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-60"
        aria-label={`Change role for ${displayName}`}
      >
        {roles.map((roleName) => (
          <option key={roleName} value={roleName}>
            Make {roleName}
          </option>
        ))}
      </select>

      <button
        type="button"
        disabled={isSubmitting}
        onClick={() =>
          runAction(
            "suspend",
            suspended ? "false" : "true",
            suspended ? `${displayName} is unsuspended.` : `${displayName} is suspended.`
          )
        }
        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
          suspended
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
            : "border-rose-500/20 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20"
        }`}
      >
        {suspended ? "Unsuspend" : "Suspend"}
      </button>
    </div>
  );
}
