import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserPayments } from "@/lib/api/payments";

export default async function RecruiterBillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;

  if (!user) {
    redirect("/auth/signin?redirect=/dashboard/recruiter/billing");
  }

  const payments = await getUserPayments(user.id, user.email);

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide">
            Billing
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Billing information
          </h1>
          <p className="mt-2 text-sm">
            View your recruiter plan payment history and billing details.
          </p>
        </div>

        <Link
          href="/plans"
          className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          View plans
        </Link>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-sm text-slate-600">No billing information found yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <article key={payment._id || payment.stripeSessionId} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{payment.planName}</h2>
                  <p className="mt-1 text-sm text-slate-600">{payment.planId}</p>
                  <p className="mt-3 text-2xl font-semibold text-emerald-600">{payment.amountText}</p>
                </div>

                <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2 lg:min-w-[420px]">
                  <p><span className="font-semibold text-slate-900">Status:</span> {payment.paymentStatus}</p>
                  <p><span className="font-semibold text-slate-900">Paid:</span> {payment.createdAtText}</p>
                  <p><span className="font-semibold text-slate-900">Started:</span> {payment.planStartedAtText}</p>
                  <p><span className="font-semibold text-slate-900">Expires:</span> {payment.planExpiresAtText}</p>
                  <p className="sm:col-span-2 break-all">
                    <span className="font-semibold text-slate-900">Stripe subscription:</span> {payment.stripeSubscriptionId}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
