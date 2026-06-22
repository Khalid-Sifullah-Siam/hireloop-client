import { getAllPayments } from "@/lib/api/payments";

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments();
  const totalAmount = payments.reduce((sum, payment) => {
    const numberText = payment.amountText.split(" ")[1] || "0";
    return sum + Number(numberText);
  }, 0);

  return (
    <section className="space-y-6 text-slate-100">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Payments
        </p>
        <h1 className="mt-2 text-3xl font-bold text-white">
          Payment details
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Admin can view plan purchases and Stripe payment information here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">
          <p className="text-sm text-slate-400">Total payments</p>
          <p className="mt-2 text-3xl font-semibold text-white">{payments.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">
          <p className="text-sm text-slate-400">Total amount</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-400">
            {totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-5">
          <p className="text-sm text-slate-400">Latest payment</p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {payments[0]?.createdAtText || "N/A"}
          </p>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#161616] p-8 text-center">
          <p className="text-sm text-slate-400">No payment details found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#161616]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-400">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Plan</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Started</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Stripe Session</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id || payment.stripeSessionId} className="border-b border-white/5 last:border-b-0">
                  <td className="p-4">
                    <p className="font-medium text-white">{payment.userName}</p>
                    <p className="mt-1 text-xs text-slate-500">{payment.userEmail}</p>
                  </td>
                  <td className="p-4 capitalize text-slate-300">{payment.role}</td>
                  <td className="p-4">
                    <p className="text-slate-200">{payment.planName}</p>
                    <p className="mt-1 text-xs text-slate-500">{payment.planId}</p>
                  </td>
                  <td className="p-4 font-semibold text-emerald-400">{payment.amountText}</td>
                  <td className="p-4 capitalize text-slate-300">{payment.paymentStatus}</td>
                  <td className="p-4 text-slate-300">{payment.planStartedAtText}</td>
                  <td className="p-4 text-slate-300">{payment.planExpiresAtText}</td>
                  <td className="max-w-48 truncate p-4 text-xs text-slate-500">
                    {payment.stripeSessionId}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
