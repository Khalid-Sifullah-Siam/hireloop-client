import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getSeekerSavedJobs } from "@/lib/api/saved-jobs";
import { removeSavedJob } from "@/lib/actions/saved-jobs";

export default async function SavedJobsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    redirect("/auth/signin?redirect=/dashboard/seeker/saved-jobs");
  }

  if (user.role !== "seeker") {
    return (
      <p className="my-[10%] text-center text-2xl font-bold text-muted">
        Only job seekers can view saved jobs.
      </p>
    );
  }

  const savedJobs = await getSeekerSavedJobs(user.id, user.email);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Saved Jobs
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Jobs you saved
          </h1>
          <p className="mt-2 text-sm">
            Save jobs from the job details page and apply later from here.
          </p>
        </div>

        <Link
          href="/jobs"
          className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Browse jobs
        </Link>
      </div>

      {savedJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">No saved jobs yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            When you save a job, it will show here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {savedJobs.map((savedJob) => (
            <article
              key={savedJob._id || savedJob.jobId}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {savedJob.jobInfo.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-600">
                    {savedJob.jobInfo.companyName}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      {savedJob.jobInfo.jobType}
                    </span>
                    {savedJob.jobInfo.location ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1">
                        {savedJob.jobInfo.location}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Saved: {savedJob.savedAtText}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">
                      Deadline: {savedJob.jobInfo.deadlineText}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/jobs/${savedJob.jobId}`}
                    className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/job/${savedJob.jobId}/apply`}
                    className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Apply
                  </Link>
                  <form action={removeSavedJob}>
                    <input type="hidden" name="jobId" value={savedJob.jobId} />
                    <input type="hidden" name="returnTo" value="/dashboard/seeker/saved-jobs" />
                    <button
                      type="submit"
                      className="inline-flex rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
