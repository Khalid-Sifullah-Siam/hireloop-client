import DashboardStats from "@/Components/Dashboard/DashboardStats";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ArrowUpRight, Briefcase, Sparkles, Target, Users } from "lucide-react";

const recruiterStats = [
  { title: "Total Job Posts", value: "48", iconName: "fileText" },
  { title: "Total Applicants", value: "1,284", iconName: "users" },
  { title: "Active Jobs", value: "18", iconName: "zap" },
  { title: "Jobs Closed", value: "32", iconName: "checkCircle" },
];

const recruiterPillars = [
  { label: "Create jobs faster", icon: Briefcase },
  { label: "Track applicant flow", icon: Users },
  { label: "Keep hiring moving", icon: Target },
];

export default async function RecruiterDashboardHomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#08111f] px-6 py-8 text-white shadow-[0_30px_100px_rgba(8,17,31,0.4)] sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.16),_transparent_30%)]" />
      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
              <Sparkles className="h-4 w-4" />
              Recruiter workspace
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome back, {user?.name || "Recruiter"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Stay on top of hiring, see your most important numbers at a glance, and move from posting to shortlist with less friction.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/60">Current priority</p>
            <p className="mt-2 text-lg font-semibold text-white">Keep your best roles active and visible</p>
          </div>
        </div>

        <div className="mt-8">
          <DashboardStats stats={recruiterStats} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">Hiring flow at a glance</h2>
            <div className="mt-4 space-y-3">
              {recruiterPillars.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-200">
                    <Icon className="h-4 w-4 text-sky-200" />
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-sky-400/15 bg-gradient-to-br from-sky-400/15 to-cyan-500/10 p-6 backdrop-blur-sm">
            <p className="text-sm font-medium text-sky-100/80">Quick action</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Post a new job with a clean, focused flow</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              The dashboard is intentionally simple, with premium panels and clear hierarchy, so the recruiter feels guided instead of overwhelmed.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white">
              Go to job posting
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
