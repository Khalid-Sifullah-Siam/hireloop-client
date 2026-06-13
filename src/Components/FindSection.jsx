'use client';

const trendingJobs = ["Product Designer", "AI Engineering", "DevOps Engineer"];

export default function FindSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(at_bottom,#3b82f6_0%,transparent_70%)] opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_0.5px,transparent_1px)] opacity-10 [background-size:50px_50px]" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-6 py-2">
          <span className="text-sm font-bold text-orange-400">HOT</span>
          <span className="text-sm font-medium tracking-wide">
            50,000+ NEW JOBS THIS MONTH
          </span>
        </div>

        <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tight md:text-7xl">
          Find Your Dream Job Today
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-xl text-zinc-400">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role faster.
        </p>

        <div className="mx-auto mb-8 max-w-3xl">
          <div className="flex items-center rounded-2xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
            <div className="flex flex-1 items-center gap-3 border-r border-zinc-700 px-6 py-4">
              <SearchIcon />
              <input
                type="text"
                placeholder="Job title, skill or company"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-zinc-500"
              />
            </div>

            <div className="flex flex-1 items-center gap-3 px-6 py-4">
              <LocationIcon />
              <input
                type="text"
                placeholder="Location or Remote"
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-zinc-500"
              />
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-violet-600 px-10 py-4 font-semibold transition-colors hover:bg-violet-700">
              <span>Search</span>
              <ArrowIcon />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-zinc-500">Trending:</span>
          <div className="flex flex-wrap gap-2">
            {trendingJobs.map((jobTitle) => (
              <button
                key={jobTitle}
                className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm transition-all hover:border-zinc-600 hover:bg-zinc-800"
              >
                {jobTitle}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-blue-600/20 to-transparent" />
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      className="h-5 w-5 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      className="h-5 w-5 text-zinc-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <path
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 5l7 7-7 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
}
