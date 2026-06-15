import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLAN_PRICE_ID = {
    'seeker_pro': 'price_1Tib0LDLrgNUOZZUGb5HWPMU',
    'seeker_premium': 'price_1TibhCDLrgNUOZZU3czQcfnf',
    'recruiter_growth': 'price_1Tibi6DLrgNUOZZUremL7MTn',
    'recruiter_enterprise': 'price_1TibijDLrgNUOZZUddfqSfdf'
}