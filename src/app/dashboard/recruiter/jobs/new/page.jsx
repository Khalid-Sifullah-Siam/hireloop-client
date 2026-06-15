"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createJob, getCurrentRecruiterPlanStatus } from "@/lib/actions/jobs";
import { getCompanies } from "@/lib/actions/companies";
import { getRecruiterJobs } from "@/lib/api/jobs";
import { authClient } from "@/lib/auth-client";
import {
  formatPlanLimit,
  getPlanName,
  getRecruiterJobLimit,
} from "@/lib/plan-utils";
import { toast } from "@heroui/react";
import {
  Briefcase,
  CalendarDays,
  ChevronDown,
  Globe2,
  MapPin,
  X,
} from "lucide-react";

const defaultCompany = {
  id: "",
  name: "",
  logo: "",
  industry: "",
  location: "",
  approved: false,
};

const jobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];

const categories = [
  "Technology",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Customer Support",
];

const currencies = ["USD", "BDT", "EUR", "GBP"];

const selectOptionClassName = "bg-white text-slate-900";

const selectOptionStyle = {
  backgroundColor: "#ffffff",
  color: "#0f172a",
};

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]";

const selectClass =
  "mt-2 h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]";

const textareaClass =
  "mt-2 min-h-[148px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]";

function SectionHeader({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#7ebfff]">
        <Icon className="h-4 w-4" />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-xl font-semibold text-white">{title}</h2>

        <p className="mt-1 text-sm leading-6 text-white/55">{description}</p>
      </div>
    </div>
  );
}

function Field({ label, hint, className = "", children }) {
  return (
    <label className={`block ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-white">{label}</span>

        {hint && <span className="text-xs text-white/40">{hint}</span>}
      </div>

      {children}
    </label>
  );
}

export default function NewJob() {
  const [isRemote, setIsRemote] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [company, setCompany] = useState(defaultCompany);
  const [activeJobCount, setActiveJobCount] = useState(0);
  const [planStatus, setPlanStatus] = useState({
    plan: "recruiter_free",
    planExpiresAt: null,
    isExpired: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    let isActive = true;

    const loadCompany = async () => {
      try {
        const companies = await getCompanies();

        if (!isActive) {
          return;
        }

        if (companies.length > 0) {
          setCompanies(companies);
          setSelectedCompanyId(companies[0].id || "");
          setCompany({
            ...defaultCompany,
            ...companies[0],
            approved: companies[0].status === "approved",
          });
        }
      } catch {
        if (isActive) {
          setCompany(defaultCompany);
        }
      }
    };

    loadCompany();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const nextCompany = companies.find((item) => item.id === selectedCompanyId);

    if (nextCompany) {
      setCompany({
        ...defaultCompany,
        ...nextCompany,
        approved: nextCompany.status === "approved",
      });
    }
  }, [companies, selectedCompanyId]);

  useEffect(() => {
    let isMounted = true;

    const loadRecruiterJobs = async () => {
      if (session?.user?.role !== "recruiter") {
        setActiveJobCount(0);
        return;
      }

      try {
        const jobs = await getRecruiterJobs(session.user.id);

        if (isMounted) {
          setActiveJobCount(jobs.length);
        }
      } catch {
        if (isMounted) {
          setActiveJobCount(0);
        }
      }
    };

    loadRecruiterJobs();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, session?.user?.role]);

  useEffect(() => {
    let isMounted = true;

    const loadPlanStatus = async () => {
      if (session?.user?.role !== "recruiter") {
        return;
      }

      const currentPlanStatus = await getCurrentRecruiterPlanStatus();

      if (isMounted) {
        setPlanStatus(currentPlanStatus);
      }
    };

    loadPlanStatus();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, session?.user?.role]);

  const recruiterPlan = planStatus.plan;
  const jobLimit = getRecruiterJobLimit(recruiterPlan);
  const remainingSlots = Math.max(jobLimit - activeJobCount, 0);
  const usedSlots = Math.min(activeJobCount, jobLimit);
  const canPublish = remainingSlots > 0;

  const statusMessage =
    planStatus.isExpired
      ? "Your paid plan expired after 30 days. You are back on the Free plan."
      : remainingSlots === 0
      ? `Your ${getPlanName(recruiterPlan)} plan has reached its active job limit of ${formatPlanLimit(jobLimit)}.`
      : `You have ${remainingSlots} active job slots left on the ${getPlanName(recruiterPlan)} plan.`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!company.id) {
      alert("Please add a company first.");
      return;
    }

    if (!canPublish || isSubmitting) {
      alert(statusMessage);
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.target);

    formData.append("isRemote", isRemote);
    formData.append("companyId", company.id);
    formData.append("companyName", company.name);
    formData.append("companyLogo", company.logo || "");
    formData.append("companyPlan", getPlanName(recruiterPlan));
    formData.append("companyApproved", company.approved);
    formData.append("status", "active");
    formData.append("visibility", "public");

    const data = Object.fromEntries(formData.entries());

    console.log(data);

    const result = await createJob(formData);

    if (result?.success) {
      toast.success("Job post created successfully.");
      setActiveJobCount((currentCount) => currentCount + 1);

      e.target.reset();
      setIsRemote(false);
      router.push("/dashboard/recruiter");
    } else if (result?.message) {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  };

  if (isPending) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0f] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#0a84ff]/20 blur-3xl" />
        <div className="absolute right-0 top-24 h-72 w-72 rounded-full bg-[#ff8a00]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <div className="rounded-[32px] border border-white/10 bg-[#111114]/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <SectionHeader
              icon={Briefcase}
              eyebrow="Job Post"
              title="Create a new opening"
              description="Add the role details, salary range, and description before publishing."
            />

            <Link
              href="/dashboard/recruiter/jobs"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Plan
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {getPlanName(recruiterPlan)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Used
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {usedSlots} / {formatPlanLimit(jobLimit)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
                Remaining
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatPlanLimit(remainingSlots)}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70">
            {statusMessage}
          </div>

          {canPublish ? (
            <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
              <Field label="Company" hint="Required" className="md:col-span-2">
                <div className="relative">
                  <select
                    value={selectedCompanyId}
                    onChange={(event) => setSelectedCompanyId(event.target.value)}
                    required
                    className={selectClass}
                  >
                    {companies.length === 0 ? (
                      <option value="" className={selectOptionClassName} style={selectOptionStyle}>
                        No company found
                      </option>
                    ) : (
                      companies.map((item) => (
                        <option
                          key={item.id}
                          value={item.id}
                          className={selectOptionClassName}
                          style={selectOptionStyle}
                        >
                          {item.name}
                        </option>
                      ))
                    )}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                </div>
              </Field>

              <Field label="Job Title" hint="Required" className="md:col-span-2">
                <input
                  type="text"
                  name="jobTitle"
                  required
                  className={inputClass}
                  placeholder="e.g. Senior Frontend Engineer"
                />
              </Field>

              <Field label="Job Category" hint="Required">
                <div className="relative">
                  <select
                    name="category"
                    required
                    defaultValue="Technology"
                    className={selectClass}
                  >
                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                        className={selectOptionClassName}
                        style={selectOptionStyle}
                      >
                        {category}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                </div>
              </Field>

              <Field label="Job Type" hint="Required">
                <div className="relative">
                  <select
                    name="jobType"
                    required
                    defaultValue="Full-time"
                    className={selectClass}
                  >
                    {jobTypes.map((type) => (
                      <option
                        key={type}
                        value={type}
                        className={selectOptionClassName}
                        style={selectOptionStyle}
                      >
                        {type}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                </div>
              </Field>

              <Field label="Minimum Salary" hint="Required">
                <input
                  type="number"
                  name="minSalary"
                  required
                  min="0"
                  className={inputClass}
                  placeholder="60000"
                />
              </Field>

              <Field label="Maximum Salary" hint="Required">
                <input
                  type="number"
                  name="maxSalary"
                  required
                  min="0"
                  className={inputClass}
                  placeholder="90000"
                />
              </Field>

              <Field label="Currency" hint="Required">
                <div className="relative">
                  <select
                    name="currency"
                    required
                    defaultValue="USD"
                    className={selectClass}
                  >
                    {currencies.map((currency) => (
                      <option
                        key={currency}
                        value={currency}
                        className={selectOptionClassName}
                        style={selectOptionStyle}
                      >
                        {currency}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                </div>
              </Field>

              <Field label={isRemote ? "Remote location hint" : "Location"}>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    type="text"
                    name="location"
                    required={!isRemote}
                    defaultValue="Dhaka, Bangladesh"
                    className={`${inputClass} pl-11`}
                    placeholder={
                      isRemote ? "e.g. UTC, APAC, Worldwide" : "City, Country"
                    }
                  />
                </div>
              </Field>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Remote toggle
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Flip this on for remote or hybrid roles.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsRemote(!isRemote)}
                    className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
                      isRemote
                        ? "border-[#6fb7ff]/50 bg-[#0a84ff]"
                        : "border-white/10 bg-white/10"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        isRemote ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-white/55">
                  {isRemote ? (
                    <Globe2 className="h-4 w-4 text-[#7ebfff]" />
                  ) : (
                    <MapPin className="h-4 w-4 text-white/45" />
                  )}

                  <span>
                    {isRemote ? "Remote role enabled" : "Office or hybrid role"}
                  </span>
                </div>
              </div>

              <Field
                label="Application Deadline"
                hint="Required"
                className="md:col-span-2"
              >
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    type="date"
                    name="deadline"
                    required
                    className={`${inputClass} pl-11 [color-scheme:dark]`}
                  />
                </div>
              </Field>

              <Field label="Responsibilities" hint="Required">
                <textarea
                  name="responsibilities"
                  required
                  className={textareaClass}
                  placeholder="Write the core responsibilities for this role..."
                />
              </Field>

              <Field label="Requirements" hint="Required">
                <textarea
                  name="requirements"
                  required
                  className={textareaClass}
                  placeholder="List the must-have skills, experience, and qualifications..."
                />
              </Field>

              <Field label="Benefits" hint="Optional" className="md:col-span-2">
                <textarea
                  name="benefits"
                  className={textareaClass}
                  placeholder="Add perks, learning opportunities, flexible hours, and other benefits..."
                />
              </Field>

              <div className="md:col-span-2 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-white/50">
                  When you submit, the job is saved as{" "}
                  <span className="text-white">active</span> and made publicly
                  visible.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition ${
                    !isSubmitting
                      ? "bg-white text-slate-950 hover:bg-slate-200"
                      : "cursor-not-allowed bg-white/20 text-white/40"
                  }`}
                >
                  {isSubmitting ? "Publishing..." : "Publish Job"}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-6">
              <p className="text-lg font-semibold text-white">
                Limit sas
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Your {getPlanName(recruiterPlan)} plan already used all{" "}
                {formatPlanLimit(jobLimit)} job create quota.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Plan upgrade koro to create more jobs.
              </p>
              <Link
                href="/plans"
                className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Upgrade plan
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
