import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSeekerApplications } from "@/lib/api/applications";
import {
    formatPlanLimit,
    getPlanName,
    getSeekerApplicationLimit,
} from "@/lib/plan-utils";
import { getFreshUserPlan } from "@/lib/user-plan-server";

const ApplicationsPage = async ({ searchParams }) => {
    const params = await searchParams;
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    const user = session?.user;

    if (!user) {
        redirect("/auth/signin?redirect=/dashboard/seeker/applications");
    }

    if (user.role !== "seeker") {
        return (
            <p className="my-[10%] text-center text-2xl font-bold text-muted">
                Only job seekers can view applications.
            </p>
        );
    }

    const applications = await getSeekerApplications(user.id, user.email);
    const seekerPlan = await getFreshUserPlan(user, "seeker_free");
    const applicationLimit = getSeekerApplicationLimit(seekerPlan);

    return (
        <section className="mx-auto max-w-5xl">
            <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    My applications
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Jobs you applied to
                </h1>
                <p className="mt-2 text-sm text-slate-600">
                    You can apply to {formatPlanLimit(applicationLimit)} jobs on your {getPlanName(seekerPlan)} plan. Your old applications stay here.
                </p>
            </div>

            {params?.success ? (
                <p className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {params.success}
                </p>
            ) : null}

            {params?.error ? (
                <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {params.error}
                </p>
            ) : null}

            {applications.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
                    <h2 className="text-xl font-bold text-slate-900">No applications yet</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Apply for a job first, then it will show here.
                    </p>
                    <Link
                        href="/jobs"
                        className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                    >
                        Browse jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((application) => (
                        <article
                            key={application._id}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">
                                        {application.jobInfo.title || "Untitled job"}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        {application.jobInfo.companyName || "N/A"} · {application.jobInfo.location || "N/A"}
                                    </p>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                                    {application.status}
                                </span>
                            </div>

                            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                                <p className="text-black">
                                    <span className="font-semibold text-slate-700">Applied at:</span>{" "}
                                    {application.appliedAtText}
                                </p>
                                <p className="text-black">
                                    <span className="font-semibold text-slate-700">Email:</span>{" "}
                                    {application.userInfo.email || "N/A"}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-700">Resume:</span>{" "}
                                    {application.applicationInfo.resumeLink ? (
                                        <a
                                            href={application.applicationInfo.resumeLink}
                                            target="_blank"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Open resume
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                                <p>
                                    <span className="font-semibold text-slate-700">Portfolio:</span>{" "}
                                    {application.applicationInfo.portfolioLink ? (
                                        <a
                                            href={application.applicationInfo.portfolioLink}
                                            target="_blank"
                                            className="text-blue-600 hover:underline"
                                        >
                                            Open portfolio
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </p>
                            </div>

                            {application.applicationInfo.message ? (
                                <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                                    {application.applicationInfo.message}
                                </p>
                            ) : null}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
};

export default ApplicationsPage;
