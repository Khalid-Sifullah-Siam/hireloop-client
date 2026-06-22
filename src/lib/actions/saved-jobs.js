'use server';

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getBackendJsonHeaders } from "@/lib/server-auth-token";

const getSavedJobsApiUrl = (path = "") => {
    const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

    if (!serverUrl) {
        throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
    }

    return `${serverUrl}/saved-jobs${path}`;
};

const getCurrentSeeker = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "seeker") {
        return null;
    }

    return session.user;
};

const parseResponse = async (response) => {
    try {
        return await response.json();
    } catch {
        return {};
    }
};

export async function saveJob(formData) {
    const seeker = await getCurrentSeeker();
    const jobId = String(formData.get("jobId") || "");

    if (!seeker) {
        redirect(`/auth/signin?redirect=/jobs/${jobId}`);
    }

    const response = await fetch(getSavedJobsApiUrl(), {
        method: "POST",
        headers: getBackendJsonHeaders(seeker),
        body: JSON.stringify({ jobId }),
    });

    const data = await parseResponse(response);

    if (!response.ok) {
        redirect(`/jobs/${jobId}?error=${encodeURIComponent(data?.message || "Failed to save job.")}`);
    }

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath(`/job/${jobId}`);
    revalidatePath("/dashboard/seeker/saved-jobs");
    redirect(`/jobs/${jobId}?success=Job saved successfully`);
}

export async function removeSavedJob(formData) {
    const seeker = await getCurrentSeeker();
    const jobId = String(formData.get("jobId") || "");
    const returnTo = String(formData.get("returnTo") || "/dashboard/seeker/saved-jobs");

    if (!seeker) {
        redirect("/auth/signin");
    }

    await fetch(getSavedJobsApiUrl(`/${jobId}`), {
        method: "DELETE",
        headers: getBackendJsonHeaders(seeker),
    });

    revalidatePath(`/jobs/${jobId}`);
    revalidatePath(`/job/${jobId}`);
    revalidatePath("/dashboard/seeker/saved-jobs");
    redirect(returnTo);
}
