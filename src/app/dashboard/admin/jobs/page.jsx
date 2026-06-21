import { Briefcase, CheckCircle2, CircleSlash2, Clock3 } from "lucide-react";
import { getAdminJobs } from "@/lib/actions/admin-jobs";
import AdminJobAction from "./admin-job-action";

const filterItems = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Expired", value: "expired" },
];

function formatDate(dateValue) {
  if (!dateValue) return "N/A";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

function getStatusStyles(status) {
  if (status === "approved") return { dot: "bg-emerald-400", text: "text-emerald-400", chip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" };
  if (status === "rejected") return { dot: "bg-rose-400", text: "text-rose-400", chip: "border-rose-500/20 bg-rose-500/10 text-rose-300" };
  if (status === "expired") return { dot: "bg-slate-400", text: "text-slate-400", chip: "border-slate-500/20 bg-slate-500/10 text-slate-300" };
  return { dot: "bg-amber-400", text: "text-amber-400", chip: "border-amber-500/20 bg-amber-500/10 text-amber-300" };
}

function buildStats(jobs) {
  return {
    pendingCount: jobs.filter((job) => job.status === "pending").length,
    approvedCount: jobs.filter((job) => job.status === "approved").length,
    rejectedCount: jobs.filter((job) => job.status === "rejected").length,
    expiredCount: jobs.filter((job) => job.status === "expired").length,
  };
}

export default async function AdminJobsPage({ searchParams }) {
  const params = await searchParams;
  const activeFilter = String(params?.status || "all").toLowerCase();
  const jobs = await getAdminJobs(activeFilter);
  const allJobs = await getAdminJobs("all");
  const { pendingCount, approvedCount, rejectedCount, expiredCount } = buildStats(allJobs);

  return (
    <section className="space-y-8 text-white">
      <div className="rounded-[32px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              <Briefcase className="h-4 w-4" />
              Admin jobs
            </div>
            <h1 className="mt-4 text-3xl font-semibold text-white">Jobs</h1>
            <p className="mt-3 max-w-2xl text-sm text-white/55">
              Review every recruiter job post, check the status, and approve or reject them from one list.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/55">Current filter</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {filterItems.find((item) => item.value === activeFilter)?.label || "All"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/55">Pending jobs</p>
            <p className="mt-3 text-4xl font-semibold text-white">{pendingCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/55">Approved jobs</p>
            <p className="mt-3 text-4xl font-semibold text-white">{approvedCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-white/55">Rejected jobs</p>
            <p className="mt-3 text-4xl font-semibold text-white">{rejectedCount}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 md:col-span-3 xl:col-span-1">
            <p className="text-sm text-white/55">Expired jobs</p>
            <p className="mt-3 text-4xl font-semibold text-white">{expiredCount}</p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a1b]">
          <div className="hidden grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr_1.2fr_1fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/55 lg:grid">
            <p>Title</p>
            <p>Recruiter</p>
            <p>Company</p>
            <p>Status</p>
            <p>Created</p>
            <p>Action</p>
            <p>Details</p>
          </div>

          {jobs.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">No jobs found</p>
              <p className="mt-2 text-sm text-white/55">Try another filter or wait for recruiter posts.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const status = String(job.status || "pending").toLowerCase();
              const statusStyles = getStatusStyles(status);

              return (
                <div key={job._id} className="border-b border-white/5 px-5 py-5 last:border-b-0">
                  <div className="grid gap-4 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr_1fr_1.2fr_1fr] lg:items-center">
                    <div>
                      <p className="font-medium text-white">{job.title || "Untitled job"}</p>
                      <p className="mt-1 text-xs text-white/40">{job.category || "N/A"} • {job.jobType || "N/A"}</p>
                    </div>

                    <p className="text-sm text-white/70">{job.recruiterEmail || "N/A"}</p>
                    <p className="text-sm text-white/70">{job.companyName || "N/A"}</p>

                    <div className={`inline-flex items-center gap-2 text-sm ${statusStyles.text}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${statusStyles.dot}`} />
                      <span className="capitalize">{status}</span>
                    </div>

                    <p className="text-sm text-white/70">{formatDate(job.createdAt)}</p>

                    <div className="flex flex-wrap gap-2">
                      {status === "pending" ? (
                        <>
                          <AdminJobAction jobId={job._id} status="approved" />
                          <AdminJobAction jobId={job._id} status="rejected" />
                        </>
                      ) : status === "approved" ? (
                        <AdminJobAction jobId={job._id} status="rejected" />
                      ) : status === "rejected" ? (
                        <AdminJobAction jobId={job._id} status="approved" />
                      ) : (
                        <span className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium ${statusStyles.chip}`}>
                          Expired
                        </span>
                      )}
                    </div>

                    <div>
                      <span className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium ${statusStyles.chip}`}>
                        {job.visibility || "public"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
