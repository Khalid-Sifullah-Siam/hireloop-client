"use client";

import Link from "next/link";

export default function Error({ error, reset }) {
  return (
    <main className="min-h-screen bg-gray-100 text-gray-950">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 sm:px-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-950 text-sm font-black text-white shadow-sm">
              HL
            </div>

            <div>
              <h1 className="text-lg font-black tracking-tight text-gray-950">
                HireLoop
              </h1>
              <p className="text-xs font-medium text-gray-500">
                Job Portal Platform
              </p>
            </div>
          </Link>

          <Link
            href="/"
            className="hidden rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 sm:inline-flex"
          >
            Homepage
          </Link>
        </header>

        {/* Main Content */}
        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex rounded-full bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700">
              500 / Application Error
            </div>

            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Something went wrong on HireLoop.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              We couldn’t load this page because of an unexpected issue. You can
              try again, return to the homepage, or continue browsing active job
              opportunities.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-950 px-7 text-sm font-bold text-white shadow-md transition hover:bg-gray-800"
              >
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-7 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
              >
                Go to Homepage
              </Link>

              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-7 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
              >
                Browse Jobs
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <QuickAction title="Explore Jobs" href="/jobs" />
              <QuickAction title="Companies" href="/companies" />
              <QuickAction title="Dashboard" href="/dashboard" />
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gray-200/70 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-2xl">
              <div className="border-b border-gray-200 bg-gray-950 px-6 py-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      HireLoop System
                    </p>
                    <h3 className="mt-1 text-xl font-black">
                      Page Load Status
                    </h3>
                  </div>

                  <div className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-200">
                    Error
                  </div>
                </div>
              </div>

              <div className="space-y-5 bg-white p-6">
                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="h-4 w-44 rounded-full bg-gray-300" />
                      <div className="mt-3 h-3 w-32 rounded-full bg-gray-200" />
                    </div>

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-200 text-xl font-black text-gray-700">
                      !
                    </div>
                  </div>

                  <div className="my-5 h-px w-full bg-gray-200" />

                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-full bg-gray-200" />
                    <div className="h-3 w-10/12 rounded-full bg-gray-200" />
                    <div className="h-3 w-7/12 rounded-full bg-gray-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoBox label="Status" value="Request Failed" />
                  <InfoBox label="Action" value="Retry Page" />
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gray-950 p-5 text-white">
                  <p className="text-sm font-semibold text-gray-300">
                    Recommended action
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black">
                        Reload this page
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        The issue may be temporary. Try again to continue.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-gray-200"
                    >
                      Retry
                    </button>
                  </div>
                </div>

                {process.env.NODE_ENV === "development" && error?.message && (
                  <div className="rounded-3xl border border-red-100 bg-red-50 p-5">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-500">
                      Development Error
                    </p>
                    <p className="mt-2 break-words text-sm leading-6 text-red-700">
                      {error.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickAction({ title, href }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-950 hover:shadow-md"
    >
      {title}
    </Link>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-base font-black text-gray-900">{value}</p>
    </div>
  );
}