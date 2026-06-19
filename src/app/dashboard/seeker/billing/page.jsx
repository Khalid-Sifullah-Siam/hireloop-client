import Link from "next/link";

export default function SeekerBillingPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Billing
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Manage your plan
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          View available plans and upgrade your seeker account when needed.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-700">
          Your billing options are available on the plans page.
        </p>

        <Link
          href="/plans"
          className="mt-5 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          View plans
        </Link>
      </div>
    </section>
  );
}
