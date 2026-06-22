import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProfileSettingsForm from "@/Components/Dashboard/ProfileSettingsForm";
import { auth } from "@/lib/auth";
import { getMyProfile } from "@/lib/api/profile";

export default async function RecruiterSettingsPage({ searchParams }) {
  const params = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    redirect("/auth/signin?redirect=/dashboard/recruiter/settings");
  }

  const profile = await getMyProfile();

  return (
    <div className="p-6 text-white">
      <ProfileSettingsForm
        user={profile || user}
        role="recruiter"
        success={params?.success || ""}
        error={params?.error || ""}
      />
    </div>
  );
}
