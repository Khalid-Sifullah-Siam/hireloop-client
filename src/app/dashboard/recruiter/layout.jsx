import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

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

  return children;
}
