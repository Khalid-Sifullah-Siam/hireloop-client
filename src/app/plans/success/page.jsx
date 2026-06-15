import { redirect } from 'next/navigation'
import { ObjectId } from 'mongodb'

import { db } from '@/lib/db'
import { getPlanName } from '@/lib/plan-utils'
import { stripe } from '@/lib/stripe'
import { getPlanExpireDate } from '@/lib/user-plan-server'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  if (session.status === 'open') {
    redirect('/')
  }

  if (session.status !== 'complete') {
    redirect('/plans')
  }

  const planId = session.metadata?.planId || ''
  const planName = getPlanName(planId)
  const customerEmail =
    session.customer_details?.email || session.customer_email || 'your email'
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (session.metadata?.userId && planId) {
    const userId = session.metadata.userId
    const userRole = session.metadata?.role || ''
    const userFilters = [{ id: userId }]
    const planStartedAt = new Date()
    const planExpiresAt = getPlanExpireDate()

    if (ObjectId.isValid(userId)) {
      userFilters.push({ _id: new ObjectId(userId) })
    }

    if (customerEmail !== 'your email') {
      userFilters.push({ email: customerEmail })
    }

    await db.collection('user').updateOne(
      { $or: userFilters },
      {
        $set: {
          plan: planId,
          planStartedAt,
          planExpiresAt,
        },
        $unset: {
          planExpiredAt: '',
        },
      }
    )

    if (serverUrl) {
      await fetch(`${serverUrl}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify({
          userId,
          userName: session.customer_details?.name || '',
          userEmail: customerEmail === 'your email' ? '' : customerEmail,
          role: userRole,
          planId,
          planName,
          stripeSessionId: session.id,
          stripeCustomerId: String(session.customer || ''),
          stripeSubscriptionId: String(session.subscription || ''),
          amountTotal: session.amount_total || 0,
          currency: session.currency || '',
          paymentStatus: session.payment_status || '',
          planStartedAt,
          planExpiresAt,
        }),
      })
    }
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] px-6 py-16">
      <section className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-[#151515] p-8 shadow-2xl shadow-black/30">
        <div className="mb-6 inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
          Payment successful
        </div>

        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Your plan is now active
        </h1>

        <p className="mt-4 text-sm leading-6 text-gray-400 md:text-base">
          Your <span className="font-medium text-white">{planName}</span> plan is ready.
        </p>

        <p className="mt-3 text-sm leading-6 text-gray-400 md:text-base">
          Thanks for your payment. A confirmation email will be sent to{' '}
          <span className="font-medium text-white">{customerEmail}</span>.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-white">What happens next</p>
          <ul className="mt-3 space-y-3 text-sm text-gray-400">
            <li>- Your subscription details are now saved in Stripe.</li>
            <li>- You can use this plan for 30 days.</li>
            <li>- After 30 days, your account will return to the free plan.</li>
            <li>- If anything looks wrong, contact support anytime.</li>
          </ul>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="/plans"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Back to plans
          </a>
          <a
            href="/jobs"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go to jobs
          </a>
        </div>
      </section>
    </main>
  )
}
