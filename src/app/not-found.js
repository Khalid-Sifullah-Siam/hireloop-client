import Link from "next/link";

export default function NotFound() {
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
            href="/jobs"
            className="hidden rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 sm:inline-flex"
          >
            Browse Jobs
          </Link>
        </header>

        {/* Main Content */}
        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
          {/* Left Content */}
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex rounded-full bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700">
              404 / Page Not Found
            </div>

            <h2 className="text-5xl font-black leading-[1.05] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              This opportunity is no longer available.
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              The job post may have expired, been removed by the employer, or
              the URL may be incorrect. You can continue exploring verified jobs
              on HireLoop.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-gray-950 px-7 text-sm font-bold text-white shadow-md transition hover:bg-gray-800"
              >
                Explore Open Jobs
              </Link>

              <Link
                href="/"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-7 text-sm font-bold text-gray-800 shadow-sm transition hover:border-gray-400 hover:bg-gray-50"
              >
                Go to Homepage
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <QuickLink title="Search roles" href="/jobs" />
              <QuickLink title="View companies" href="/companies" />
              <QuickLink title="Dashboard" href="/dashboard" />
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
                      HireLoop Search
                    </p>
                    <h3 className="mt-1 text-xl font-black">
                      Job Match Result
                    </h3>
                  </div>

                  <div className="rounded-full border border-red-400/30 bg-red-400/10 px-3 py-1 text-xs font-bold text-red-200">
                    Not Found
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

                    <div className="h-11 w-11 rounded-2xl bg-gray-200" />
                  </div>

                  <div className="my-5 h-px w-full bg-gray-200" />

                  <div className="space-y-3">
                    <div className="h-3 w-full rounded-full bg-gray-200" />
                    <div className="h-3 w-10/12 rounded-full bg-gray-200" />
                    <div className="h-3 w-7/12 rounded-full bg-gray-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InfoBox label="Status" value="Expired Link" />
                  <InfoBox label="Suggestion" value="Search Again" />
                </div>

                <div className="rounded-3xl border border-gray-200 bg-gray-950 p-5 text-white">
                  <p className="text-sm font-semibold text-gray-300">
                    Recommended action
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black">
                        Discover active jobs
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-gray-400">
                        Browse current openings from verified employers.
                      </p>
                    </div>

                    <Link
                      href="/jobs"
                      className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-gray-950 transition hover:bg-gray-200"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function QuickLink({ title, href }) {
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