import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

  return children;
}
