import Link from "next/link";
import { Building2, CheckCircle2, CircleSlash2, Plus } from "lucide-react";
import { getAdminCompanies } from "@/lib/actions/admin-companies";
import FilterDropdown from "./filter-dropdown";
import AdminStatusAction from "./admin-status-action";

const filterItems = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];


function formatDate(dateValue) {
  if (!dateValue) {
    return "N/A";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function getInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (words.length === 0) {
    return "NA";
  }

  return words.map((word) => word[0]?.toUpperCase() || "").join("");
}

function getStatusStyles(status) {
  if (status === "approved") {
    return {
      dot: "bg-emerald-400",
      text: "text-emerald-400",
      chip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (status === "rejected") {
    return {
      dot: "bg-rose-400",
      text: "text-rose-400",
      chip: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    };
  }

  return {
    dot: "bg-amber-400",
    text: "text-amber-400",
    chip: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  };
}

function buildStats(companies) {
  const pendingCount = companies.filter((company) => company.status === "pending").length;
  const approvedCount = companies.filter((company) => company.status === "approved").length;
  const rejectedCount = companies.filter((company) => company.status === "rejected").length;

  return {
    pendingCount,
    approvedCount,
    rejectedCount,
  };
}

export default async function AdminCompaniesPage({ searchParams }) {
  const params = await searchParams;
  const activeFilter = String(params?.status || "all").toLowerCase();
  const companies = await getAdminCompanies(activeFilter);
  const { pendingCount, approvedCount, rejectedCount } = buildStats(companies);

  return (
    <div className="space-y-8 text-white">
      <section className="rounded-[32px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">Company Registrations</h1>
            <p className="mt-3 text-sm text-white/55">
              Review and manage corporate entity access requests for the HireLoop ecosystem.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-3">
            <FilterDropdown filterItems={filterItems} activeFilter={activeFilter} />

            <Link
              href="/dashboard/recruiter/company"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#111114] transition hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              Register New
            </Link>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-white/10 bg-[#1a1a1b]">
          <div className="hidden grid-cols-[2fr_2fr_1.3fr_1.1fr_1fr_1.3fr_1.3fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm text-white/55 lg:grid">
            <p>Company Name</p>
            <p>Recruiter Email</p>
            <p>Industry</p>
            <p>Jobs Count</p>
            <p>Status</p>
            <p>Date Submitted</p>
            <p className="text-right">Actions</p>
          </div>

          {companies.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">No companies found</p>
              <p className="mt-2 text-sm text-white/55">
                Try a different filter or wait for new company registrations.
              </p>
            </div>
          ) : (
            companies.map((company) => {
              const status = String(company.status || "pending").toLowerCase();
              const statusStyles = getStatusStyles(status);

              return (
                <div
                  key={company._id || company.id}
                  className="border-b border-white/5 px-5 py-5 last:border-b-0"
                >
                  <div className="grid gap-4 lg:grid-cols-[2fr_2fr_1.3fr_1.1fr_1fr_1.3fr_1.3fr] lg:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xs font-semibold text-white/80">
                        {getInitials(company.name)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{company.name || "N/A"}</p>
                        <p className="mt-1 text-xs text-white/40">{company.location || "N/A"}</p>
                      </div>
                    </div>

                    <p className="text-sm text-white/70">{company.recruiterEmail || "N/A"}</p>

                    <div>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/65">
                        {company.industry || "N/A"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-white/75">{company.jobsCount || 0}</p>

                    <div className={`inline-flex items-center gap-2 text-sm ${statusStyles.text}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${statusStyles.dot}`} />
                      <span className="capitalize">{status}</span>
                    </div>

                    <p className="text-sm text-white/70">{formatDate(company.createdAt)}</p>

                    <div className="flex flex-wrap justify-start gap-2 lg:justify-end">
                      {status === "pending" ? (
                        <>
                          <AdminStatusAction companyId={company.id} status="approved" />
                          <AdminStatusAction companyId={company.id} status="rejected" />
                        </>
                      ) : status === "approved" ? (
                        <AdminStatusAction companyId={company.id} status="rejected" />
                      ) : status === "rejected" ? (
                        <AdminStatusAction companyId={company.id} status="approved" />
                      ) : (
                        <span className={`inline-flex rounded-lg border px-3 py-1.5 text-xs font-medium ${statusStyles.chip}`}>
                          {status === "approved" ? "Approved" : "Rejected"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-xs text-white/45">
            <p>
              Showing {companies.length} {companies.length === 1 ? "company" : "companies"}
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-white/75">
                1
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6">
          <div className="flex items-center justify-between">
            <Building2 className="h-5 w-5 text-amber-300" />
            <p className="text-xs text-emerald-300">Needs review</p>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-white/35">Pending Review</p>
          <p className="mt-3 text-4xl font-semibold text-white">{pendingCount}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6">
          <div className="flex items-center justify-between">
            <CheckCircle2 className="h-5 w-5 text-emerald-300" />
            <p className="text-xs text-emerald-300">Approved</p>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-white/35">Approved Partners</p>
          <p className="mt-3 text-4xl font-semibold text-white">{approvedCount}</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6">
          <div className="flex items-center justify-between">
            <CircleSlash2 className="h-5 w-5 text-rose-300" />
            <p className="text-xs text-white/50">Stable</p>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.24em] text-white/35">Total Rejections</p>
          <p className="mt-3 text-4xl font-semibold text-white">{rejectedCount}</p>
        </div>
      </section>
    </div>
  );
}
