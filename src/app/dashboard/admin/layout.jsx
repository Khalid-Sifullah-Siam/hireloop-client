import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/Components/Dashboard/AdminSidebar";
import { auth } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/signin?redirect=/dashboard/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen text-white">
      <AdminSidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
