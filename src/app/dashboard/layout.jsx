import DashboardSidebar from "@/Components/Dashboard/DashboardSidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

function getDashboardRole(user) {
  if (user?.role === "admin") {
    return "admin";
  }

  if (user?.role === "recruiter" || user?.role === "seeker") {
    return user.role;
  }

  if (String(user?.plan || "").startsWith("recruiter_")) {
    return "recruiter";
  }

  return user ? "seeker" : "";
}

export default async function DashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userRole = getDashboardRole(session?.user);
  const canSeeSidebar = userRole === "recruiter" || userRole === "seeker";

  return (
    <div className="flex min-h-screen">
      {canSeeSidebar ? <DashboardSidebar role={userRole} /> : null}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
