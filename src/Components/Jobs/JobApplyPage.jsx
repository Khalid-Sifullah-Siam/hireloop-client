import Link from "next/link";
import { applyForJob } from "@/lib/actions/applications";

const JobApplyPage = ({ applicant, job }) => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fbff,_#eef5ff_45%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-600">
          <Link
            href={`/job/${job?._id}`}
            className="transition hover:text-slate-900"
          >
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
              {job?.title || "Untitled job"}
            </h1>
            <p className="mt-2 text-base text-slate-600">
              {job?.companyName || "N/A"}
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Applicant
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {applicant?.name || applicant?.email || "N/A"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Location
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {job?.location || "N/A"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Job type
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {job?.jobType || "N/A"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Deadline
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {job?.deadlineText || "N/A"}
                </p>
              </div>
            </div>

            <section className="mt-8">
              <h2 className="text-lg font-bold text-slate-900">Job details</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                {job?.responsibilities || "No responsibilities added."}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-bold text-slate-900">Requirements</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-600">
                {job?.requirements || "No requirements added."}
              </p>
            </section>
          </section>

          <aside className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] sm:p-8">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Application form
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Add your resume and portfolio link before submitting.
            </p>

            <form action={applyForJob} className="mt-6 space-y-4">
              <input type="hidden" name="jobId" value={job?._id || ""} />

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  defaultValue={applicant?.name || ""}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                  type="text"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  defaultValue={applicant?.email || ""}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:bg-white"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="resumeLink"
                  className="block text-sm font-medium text-slate-700"
                >
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
                <label
                  htmlFor="portfolioLink"
                  className="block text-sm font-medium text-slate-700"
                >
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
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-slate-700"
                >
                  Cover message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
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
          </aside>
        </div>
      </div>
    </main>
  );
};

export default JobApplyPage;
