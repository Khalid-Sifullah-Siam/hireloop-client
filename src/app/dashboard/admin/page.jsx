import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        Welcome back, {user?.name || "Admin"}
      </h1>
      <p className="text-sm">
        This is your admin dashboard.
      </p>
    </div>
  );
}
