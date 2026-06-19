import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { getSeekerApplications } from "@/lib/api/applications";
import {
    formatPlanLimit,
    getPlanName,
    getSeekerApplicationLimit,
} from "@/lib/plan-utils";
import { getFreshUserPlan } from "@/lib/user-plan-server";

const statusColorMap = {
    submitted: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    applied: "border-sky-500/30 bg-sky-500/10 text-sky-300",
    review: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    shortlisted: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    interview: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    interviewed: "border-violet-500/30 bg-violet-500/10 text-violet-300",
    offered: "border-white/20 bg-white/10 text-white",
    rejected: "border-red-500/30 bg-red-500/10 text-red-300",
    archived: "border-slate-500/30 bg-slate-500/10 text-slate-300",
    withdrawn: "border-slate-500/30 bg-slate-500/10 text-slate-300",
};

const archivedStatusList = ["rejected", "archived", "withdrawn"];

const getRelativeTime = (dateValue) => {
    if (!dateValue) {
        return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "N/A";
    }

    const diffInMs = Date.now() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
        return "Just now";
    }

    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
    }

    if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
};

const getApplicationStatus = (status) => {
    return String(status || "submitted").trim().toLowerCase();
};

const getStatusLabel = (status) => {
    const text = getApplicationStatus(status);
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const getStatusClasses = (status) => {
    return statusColorMap[getApplicationStatus(status)] || "border-slate-500/30 bg-slate-500/10 text-slate-200";
};

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
    const currentView = params?.view === "archived" ? "archived" : "active";

    const applicationRows = applications.map((application) => {
        const status = getApplicationStatus(application.status);

        return {
            ...application,
            status,
            statusLabel: getStatusLabel(status),
            appliedTime: getRelativeTime(application.appliedAt),
            isArchived: archivedStatusList.includes(status),
        };
    });

    const activeApplications = applicationRows.filter((application) => !application.isArchived);
    const archivedApplications = applicationRows.filter((application) => application.isArchived);
    const visibleApplications = currentView === "archived" ? archivedApplications : activeApplications;

    const shortlistedCount = applicationRows.filter((application) => application.status === "shortlisted").length;
    const interviewCount = applicationRows.filter((application) => (
        application.status === "interview" ||
        application.status === "interviewed" ||
        application.status === "review"
    )).length;
    const successCount = applicationRows.filter((application) => (
        application.status === "offered" ||
        application.status === "shortlisted"
    )).length;
    const successRate = applications.length === 0 ? 0 : Math.round((successCount / applications.length) * 100);

    return (
        <section className="mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-[#121212] p-4 text-white shadow-2xl shadow-black/20 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-white">
                        My Applications
                    </h1>
                    <p className="mt-2 text-sm text-slate-400">
                        Track your job applications and interview progress in real-time.
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                        You can apply to {formatPlanLimit(applicationLimit)} jobs on your {getPlanName(seekerPlan)} plan.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex rounded-xl border border-white/10 bg-[#1b1b1b] p-1">
                        <Link
                            href="/dashboard/seeker/applications?view=active"
                            className={`rounded-lg px-5 py-2 text-sm font-medium transition ${currentView === "active"
                                ? "bg-[#2a2a2a] text-white"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Active
                        </Link>
                        <Link
                            href="/dashboard/seeker/applications?view=archived"
                            className={`rounded-lg px-5 py-2 text-sm font-medium transition ${currentView === "archived"
                                ? "bg-[#2a2a2a] text-white"
                                : "text-slate-400 hover:text-white"
                                }`}
                        >
                            Archived
                        </Link>
                    </div>

                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900"
                    >
                        <Download className="h-4 w-4" />
                        Export PDF
                    </button>
                </div>
            </div>

            {params?.success ? (
                <p className="mt-5 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm font-medium text-green-300">
                    {params.success}
                </p>
            ) : null}

            {params?.error ? (
                <p className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                    {params.error}
                </p>
            ) : null}

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5">
                    <p className="text-sm text-slate-400">Total Applied</p>
                    <p className="mt-2 text-4xl font-semibold text-white">{applications.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5">
                    <p className="text-sm text-slate-400">Shortlisted</p>
                    <p className="mt-2 text-4xl font-semibold text-white">{shortlistedCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5">
                    <p className="text-sm text-slate-400">Interviews</p>
                    <p className="mt-2 text-4xl font-semibold text-amber-400">{interviewCount}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5">
                    <p className="text-sm text-slate-400">Success Rate</p>
                    <p className="mt-2 text-4xl font-semibold text-emerald-400">{successRate}%</p>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-white/10 bg-[#161616] p-8 text-center">
                    <h2 className="text-xl font-bold text-white">No applications yet</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Apply for a job first, then it will show here.
                    </p>
                    <Link
                        href="/jobs"
                        className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900"
                    >
                        Browse jobs
                    </Link>
                </div>
            ) : (
                <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#161616]">
                    <div className="hidden grid-cols-[2.2fr_1.3fr_1fr_1fr_0.8fr] gap-4 border-b border-white/10 px-6 py-4 text-sm text-slate-400 md:grid">
                        <p>Job Title</p>
                        <p>Company</p>
                        <p>Applied</p>
                        <p>Status</p>
                        <p className="text-right">Action</p>
                    </div>

                    {visibleApplications.length === 0 ? (
                        <div className="px-6 py-10 text-center">
                            <p className="text-lg font-semibold text-white">
                                No {currentView} applications
                            </p>
                            <p className="mt-2 text-sm text-slate-400">
                                When application status changes, it will appear here automatically.
                            </p>
                        </div>
                    ) : (
                        visibleApplications.map((application) => (
                            <article
                                key={application._id}
                                className="border-b border-white/5 px-6 py-5 last:border-b-0"
                            >
                                <div className="grid gap-4 md:grid-cols-[2.2fr_1.3fr_1fr_1fr_0.8fr] md:items-center">
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            {application.jobInfo.title || "Untitled job"}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {(application.jobInfo.jobType || "Full-time")}{application.jobInfo.location ? ` - ${application.jobInfo.location}` : ""}
                                        </p>
                                    </div>

                                    <p className="text-sm text-slate-300">
                                        {application.jobInfo.companyName || "N/A"}
                                    </p>

                                    <div className="text-sm text-slate-300">
                                        <p>{application.appliedTime}</p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {application.appliedAtText}
                                        </p>
                                    </div>

                                    <div>
                                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(application.status)}`}>
                                            {application.statusLabel}
                                        </span>
                                    </div>

                                    <div className="md:text-right">
                                        <Link
                                            href={`/jobs/${application.jobInfo.id}`}
                                            className="text-sm font-medium text-white hover:text-slate-300"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            )}
        </section>
    );
};

export default ApplicationsPage;
