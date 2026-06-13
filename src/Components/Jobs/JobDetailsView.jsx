import Link from "next/link";

const JobDetailsView = ({ job }) => {
    if (!job) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-12">
                <div className="mx-auto max-w-4xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">Job not found</h1>
                    <p className="mt-2 text-slate-600">
                        The job you are looking for does not exist or has been removed.
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
                <Link
                    href="/jobs"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    <span>{"<-"}</span>
                    Back to jobs
                </Link>

                <article className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.12)]">
                    <div className="h-2 bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-500" />
                    <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
                        <div className="p-6 sm:p-8 lg:p-10">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                    {job.category}
                                </span>
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {job.status}
                                </span>
                                {job.isRemote ? (
                                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
                                        Remote
                                    </span>
                                ) : null}
                            </div>

                            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                {job.title}
                            </h1>
                            <p className="mt-2 text-base font-medium text-slate-500">
                                {job.companyName}
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Job type</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{job.jobType}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{job.location}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Salary</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{job.salaryText}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deadline</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-900">{job.deadlineText}</p>
                                </div>
                            </div>

                            <div className="mt-8 space-y-6">
                                <section>
                                    <h2 className="text-lg font-bold text-slate-900">Responsibilities</h2>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {job.responsibilities || "N/A"}
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-lg font-bold text-slate-900">Requirements</h2>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {job.requirements || "N/A"}
                                    </p>
                                </section>
                                <section>
                                    <h2 className="text-lg font-bold text-slate-900">Benefits</h2>
                                    <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                                        {job.benefits || "N/A"}
                                    </p>
                                </section>
                            </div>
                        </div>

                        <aside className="border-t border-slate-200 bg-slate-50 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                            <div className="rounded-3xl bg-white p-5 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                                    Company info
                                </p>
                                <div className="mt-4 flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                                        {job.companyLogo ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-lg font-bold text-slate-500">
                                                {job.companyName?.slice(0, 1)}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-base font-semibold text-slate-900">{job.companyName}</h3>
                                        <p className="text-sm text-slate-500">Plan: {job.companyPlan}</p>
                                    </div>
                                </div>

                                <div className="mt-5 space-y-3 text-sm text-slate-600">
                                    <p><span className="font-medium text-slate-900">Recruiter ID:</span> {job.recruiterId}</p>
                                    <p><span className="font-medium text-slate-900">Visibility:</span> {job.visibility}</p>
                                    <p><span className="font-medium text-slate-900">Posted:</span> {job.createdAtText}</p>
                                    <p><span className="font-medium text-slate-900">Updated:</span> {job.updatedAtText}</p>
                                </div>
                            </div>
                        </aside>
                    </div>
                </article>
            </div>
        </main>
    );
};

export default JobDetailsView;
