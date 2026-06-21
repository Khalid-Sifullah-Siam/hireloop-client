import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getFreshUserAccountStatus } from "@/lib/user-plan-server";

function AccountApprovalMessage({ suspended }) {
  return (
    <div className="mx-auto my-16 max-w-xl rounded-3xl border border-white/10 bg-[#111114] p-8 text-center text-white">
      <h1 className="text-2xl font-semibold">
        {suspended ? "Your account is suspended" : "Your account is pending approval"}
      </h1>
      <p className="mt-3 text-sm text-white/55">
        {suspended
          ? "Please contact the admin to unsuspend your account."
          : "After admin approval, you can browse your dashboard and apply for jobs."}
      </p>
    </div>
  );
}

export default async function SeekerDashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin?redirect=/dashboard/seeker/applications");
  }

  if (session.user.role !== "seeker") {
    redirect("/dashboard/recruiter");
  }

  const accountStatus = await getFreshUserAccountStatus(session.user, "seeker_free");

  if (!accountStatus.isActive) {
    return <AccountApprovalMessage suspended={accountStatus.suspended} />;
  }

  return children;
}
