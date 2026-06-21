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
          : "After admin approval, you can create companies, post jobs, and manage recruiter tools."}
      </p>
    </div>
  );
}

export default async function RecruiterDashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin?redirect=/dashboard/recruiter");
  }

  if (session.user.role !== "recruiter") {
    redirect("/dashboard/seeker/applications");
  }

  const accountStatus = await getFreshUserAccountStatus(session.user, "recruiter_free");

  if (!accountStatus.isActive) {
    return <AccountApprovalMessage suspended={accountStatus.suspended} />;
  }

  return children;
}
