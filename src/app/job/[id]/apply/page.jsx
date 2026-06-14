import { auth } from "@/lib/auth";
import { applyForJob } from "@/lib/actions/applications";
import { getJobById } from "@/lib/api/jobs";
import { getSeekerApplications } from "@/lib/api/applications";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

const ApplyPage = async ({ params }) => {
    const { id } = await params;
    const job = await getJobById(id);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user;

    if (!user) {
        redirect(`/auth/signin?redirect=/job/${id}/apply`);
    }

    if (user.role !== "seeker") {
        return (
            <p className="my-[10%] text-center text-2xl font-bold text-muted">
                Only job seekers can apply for job.
            </p>
        );
    }

    const applications = await getSeekerApplications(user.id);
    const applicationCount = applications.length;
    const maxApplicationsPerMonth = 3;

    if (!job) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
                <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        The job information could not be loaded for this apply page.
                    </p>
                    <Link
                        href="/jobs"
                        className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        Back to jobs
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff,_#eef5ff_45%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 text-center">
                    <span className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-900 shadow-sm">
                        You have applied {applicationCount} out of {maxApplicationsPerMonth} jobs
                    </span>
                </div>

                <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600">
                    <Link href={`/job/${job._id}`} className="transition hover:text-slate-900">
                        Job details
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900">Apply</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <section className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            Apply for this job
                        </p>
                        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                            {job.title || "Untitled job"}
                        </h1>
                        <p className="mt-2 text-base text-slate-600">
                            {job.companyName || "N/A"}
                        </p>
                        <p className="mt-2 text-xs font-medium text-slate-500">Job ID: {job._id}</p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Applicant</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {user?.name || user?.email || "N/A"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {job.location || "N/A"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Job type</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {job.jobType || "N/A"}
                                </p>
                            </div>
                            <div className="rounded-2xl bg-slate-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deadline</p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {job.deadlineText || "N/A"}
                                </p>
                            </div>
                        </div>

                        <section className="mt-8">
                            <h2 className="text-lg font-bold text-slate-900">Job details</h2>
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {job.responsibilities || "No responsibilities added."}
                            </p>
                        </section>

                        <section className="mt-6">
                            <h2 className="text-lg font-bold text-slate-900">Requirements</h2>
                            <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {job.requirements || "No requirements added."}
                            </p>
                        </section>
                    </section>

                    <aside className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-8">
                        {applicationCount >= maxApplicationsPerMonth ? (
                            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                    Application limit reached
                                </h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    You have already applied for {maxApplicationsPerMonth} jobs this month, so the form is hidden.
                                </p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Application form</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Add your resume and portfolio link before submitting.
                                </p>

                                <form action={applyForJob} className="mt-6 space-y-4">
                                    <input type="hidden" name="jobId" value={job._id} />
                                    <input type="hidden" name="jobTitle" value={job.title || ""} />
                                    <input type="hidden" name="companyName" value={job.companyName || ""} />
                                    <input type="hidden" name="location" value={job.location || ""} />

                                    <div>
                                        <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                                            Full name
                                        </label>
                                        <input
                                            id="fullName"
                                            name="fullName"
                                            defaultValue={user?.name || ""}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                            type="text"
                                            placeholder="Your name"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            defaultValue={user?.email || ""}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                            type="email"
                                            placeholder="you@example.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="resumeLink" className="block text-sm font-medium text-slate-700">
                                            Resume link
                                        </label>
                                        <input
                                            id="resumeLink"
                                            name="resumeLink"
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                            type="url"
                                            placeholder="https://..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="portfolioLink" className="block text-sm font-medium text-slate-700">
                                            Portfolio link
                                        </label>
                                        <input
                                            id="portfolioLink"
                                            name="portfolioLink"
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                            type="url"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                                            Cover message
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                                            placeholder="Write a short message..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        Submit application
                                    </button>
                                </form>
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
};

export default ApplyPage;
