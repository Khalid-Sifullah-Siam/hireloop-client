import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe, PLAN_PRICE_ID } from '../../../lib/stripe'
import { auth } from '@/lib/auth'

export async function POST(request) {
  let checkoutUrl = null

  try {
    const headersList = await headers()
    const origin = headersList.get('origin')

    const formData = await request.formData()
    const planId = String(formData.get('planId') || '')

    const priceId = PLAN_PRICE_ID[planId]

    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      )
    }

    const userSession = await auth.api.getSession({
      headers: await headers()
    })

    const user = userSession?.user

    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in first' },
        { status: 401 }
      )
    }

    const isSeekerPlan = planId.startsWith('seeker_')
    const isRecruiterPlan = planId.startsWith('recruiter_')

    if (
      (user.role === 'seeker' && !isSeekerPlan) ||
      (user.role === 'recruiter' && !isRecruiterPlan) ||
      (!isSeekerPlan && !isRecruiterPlan)
    ) {
      return NextResponse.json(
        { error: 'This plan does not match your account role' },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      metadata: {
        planId,
        userId: user.id,
        role: user.role || '',
      },
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/plans`,
    })

    checkoutUrl = session.url
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }

  return NextResponse.redirect(checkoutUrl, 303)
}
