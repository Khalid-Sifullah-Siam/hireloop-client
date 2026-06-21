import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Building2, ShieldCheck, Sparkles, Users, Briefcase } from "lucide-react";

const adminHighlights = [
  { label: "Pending companies", value: "14", icon: Building2 },
  { label: "Approved listings", value: "128", icon: ShieldCheck },
  { label: "Active users", value: "8.4k", icon: Users },
  { label: "Jobs reviewed", value: "356", icon: Briefcase },
];

const adminActions = [
  "Review company approvals",
  "Watch platform activity",
  "Keep job listings clean and trusted",
];

export default async function AdminDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0f172a] px-6 py-8 text-white shadow-[0_30px_100px_rgba(15,23,42,0.35)] sm:px-8 sm:py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(99,102,241,0.16),_transparent_32%)]" />
      <div className="relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Admin control center
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome back, {user?.name || "Admin"}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Manage companies, keep the platform trustworthy, and review the most important activity from one clean dashboard.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
            <p className="text-sm text-white/60">Today's focus</p>
            <p className="mt-2 text-lg font-semibold text-white">Approve, monitor, and keep quality high</p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {adminHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/65">{item.label}</p>
                  <Icon className="h-5 w-5 text-cyan-200" />
                </div>
                <p className="mt-4 text-3xl font-semibold tracking-tight text-white">{item.value}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white">What you can do here</h2>
            <div className="mt-4 space-y-3">
              {adminActions.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-slate-200">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/15 to-indigo-500/15 p-6 backdrop-blur-sm">
            <p className="text-sm font-medium text-cyan-100/80">Platform status</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Everything is ready for daily review</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              This space is designed to feel calm, premium, and practical, so the admin can scan important signals quickly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
