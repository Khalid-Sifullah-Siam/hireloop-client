export default function SavedJobsPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Saved Jobs
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Jobs you saved
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your saved jobs will show here once that feature is connected.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-700">
          No saved jobs yet.
        </p>
      </div>
    </section>
  );
}
