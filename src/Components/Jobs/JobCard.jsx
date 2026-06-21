import Link from "next/link";

const JobCard = ({ job }) => {
    const hasRemoteTag = job.location?.toLowerCase() === "remote";
    const status = String(job.status || "pending").toLowerCase();
    const statusText =
        status === "approved"
            ? "Approved"
            : status === "rejected"
                ? "Rejected"
                : status === "expired"
                    ? "Expired"
                    : "Pending";
    const statusClass =
        status === "approved"
            ? "bg-emerald-500/15 text-emerald-300"
            : status === "rejected"
                ? "bg-rose-500/15 text-rose-300"
                : status === "expired"
                    ? "bg-slate-500/15 text-slate-300"
                    : "bg-amber-500/15 text-amber-300";

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1f] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.3)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_18px_50px_rgba(0,0,0,0.45)]">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400" />

            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                            {job.category}
                        </p>
                        <h3 className="truncate text-xl font-bold tracking-tight text-white">
                            {job.title}
                        </h3>
                        <p className="mt-1 text-sm font-medium text-white/60">
                            {job.companyName}
                        </p>
                    </div>

                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                        {statusText}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
                        {job.jobType}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/75">
                        {job.location}
                    </span>
                    {hasRemoteTag ? (
                        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                            Remote friendly
                        </span>
                    ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3 rounded-2xl bg-white/5 p-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                            Salary
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                            {job.salaryText}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                            Deadline
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">
                            {job.deadlineText}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/45">
                    <span>Posted on {job.createdAtText}</span>
                    <Link href={`/jobs/${job._id}`} className="font-medium text-white/75 group-hover:text-cyan-200">
                        View details
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default JobCard;
