import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'

import { auth } from '@/lib/auth'
import { getBackendAuthHeaders } from '@/lib/server-auth-token'
import {
  db,
  getUserFilters,
  toText,
} from '@/lib/database-helpers'
import { getPlanName } from '@/lib/plan-utils'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error('Please provide a valid session_id (`cs_test_...`)')
  }

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

  if (!serverUrl) {
    throw new Error('NEXT_PUBLIC_SERVER_URL is missing from your environment variables.')
  }

  const currentSession = await auth.api.getSession({
    headers: await headers(),
  })
  const user = currentSession?.user

  if (!user) {
    redirect('/auth/signin?redirect=/plans/success')
  }

  const sessionResponse = await fetch(`${serverUrl}/checkout_sessions/${session_id}`, {
    cache: 'no-store',
    headers: getBackendAuthHeaders(user),
  })

  if (!sessionResponse.ok) {
    redirect('/plans')
  }

  const checkoutSession = await sessionResponse.json()

  if (checkoutSession.status === 'open') {
    redirect('/')
  }

  if (checkoutSession.status !== 'complete') {
    redirect('/plans')
  }

  if (checkoutSession.metadata?.userId !== user.id) {
    redirect('/plans')
  }

  const planId = checkoutSession.metadata?.planId || ''
  const planName = getPlanName(planId)
  const customerEmail =
    checkoutSession.customer_details?.email || checkoutSession.customer_email || 'your email'

  if (checkoutSession.metadata?.userId && planId) {
    const userId = checkoutSession.metadata.userId
    const userRole = checkoutSession.metadata?.role || ''
    const planStartedAt = checkoutSession.created
      ? new Date(checkoutSession.created * 1000)
      : new Date()
    const planExpiresAt = new Date(planStartedAt)
    planExpiresAt.setDate(planExpiresAt.getDate() + 30)

    const userFilters = getUserFilters({
      id: userId,
      email: customerEmail === 'your email' ? user.email : customerEmail,
    })

    if (userFilters.length > 0) {
      await db.collection('user').updateOne(
        { $or: userFilters },
        {
          $set: {
            plan: planId,
            planStartedAt,
            planExpiresAt,
            updatedAt: new Date(),
          },
          $unset: {
            planExpiredAt: '',
          },
        }
      )
    }

    const payment = {
      userId,
      userName: checkoutSession.customer_details?.name || user.name || '',
      userEmail: customerEmail === 'your email' ? toText(user.email) : customerEmail,
      role: userRole,
      planId,
      planName,
      stripeSessionId: checkoutSession.id,
      stripeCustomerId: String(checkoutSession.customer || ''),
      stripeSubscriptionId: String(checkoutSession.subscription || ''),
      amountTotal: checkoutSession.amount_total || 0,
      currency: checkoutSession.currency || '',
      paymentStatus: checkoutSession.payment_status || '',
      planStartedAt,
      planExpiresAt,
      updatedAt: new Date(),
    }

    await db.collection('plansCollection').updateOne(
      { stripeSessionId: checkoutSession.id },
      {
        $set: payment,
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )
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
          <Link
            href="/plans"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            Back to plans
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Go to jobs
          </Link>
        </div>
      </section>
    </main>
  )
}
