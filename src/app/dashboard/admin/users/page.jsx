import { Download, Shield, UserRound } from "lucide-react";
import { getAdminUsers } from "@/lib/actions/admin-users";
import AdminUserActions from "./admin-user-actions";
import RoleFilter from "./role-filter";

const roleItems = [
  { label: "All Roles", value: "all" },
  { label: "Admins", value: "admin" },
  { label: "Seekers", value: "seeker" },
  { label: "Recruiters", value: "recruiter" },
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

function getInitials(name, email) {
  const text = String(name || email || "User").trim();
  const words = text.split(/\s+/).filter(Boolean).slice(0, 2);

  return words.map((word) => word[0]?.toUpperCase() || "").join("");
}

function getRoleStyle(role) {
  if (role === "admin") {
    return "border-cyan-400/20 bg-cyan-400/10 text-cyan-200";
  }

  if (role === "recruiter") {
    return "border-white/15 bg-white text-[#111114]";
  }

  return "border-white/10 bg-white/[0.08] text-white/75";
}

function getStatusStyle(status, suspended) {
  if (suspended) {
    return {
      dot: "bg-rose-400",
      chip: "border-rose-500/20 bg-rose-500/10 text-rose-300",
      label: "Suspended",
    };
  }

  if (status === "active") {
    return {
      dot: "bg-emerald-400",
      chip: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
      label: "Active",
    };
  }

  return {
    dot: "bg-amber-400",
    chip: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    label: "Pending",
  };
}

function getUserStatus(user) {
  const status = String(user.status || "").toLowerCase();

  if (status === "active") {
    return "active";
  }

  return "pending";
}

function buildStats(users) {
  const today = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  return {
    activeUsers: users.filter((user) => getUserStatus(user) === "active" && !user.suspended && !user.banned).length,
    recruiterUsers: users.filter((user) => String(user.role || "").toLowerCase() === "recruiter").length,
    suspendedUsers: users.filter((user) => Boolean(user.suspended || user.banned)).length,
    newUsers: users.filter((user) => {
      const createdAt = new Date(user.createdAt).getTime();
      return Number.isFinite(createdAt) && today - createdAt <= oneDay;
    }).length,
  };
}

export default async function AdminUsersPage({ searchParams }) {
  const params = await searchParams;
  const activeRole = String(params?.role || "all").toLowerCase();
  const users = await getAdminUsers(activeRole);
  const stats = buildStats(users);

  return (
    <section className="space-y-8 text-white">
      <div className="rounded-[28px] border border-white/10 bg-[#111114] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-white">User Management</h1>
            <p className="mt-2 text-sm text-white/55">
              Review, filter, and manage platform access for all users.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-3">
            <RoleFilter activeRole={activeRole} roleItems={roleItems} />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-[#111114] transition hover:bg-white/90"
            >
              <Download className="h-4 w-4" />
              Export List
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs text-white/55">Total Active Users</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.activeUsers}</p>
            <p className="mt-2 text-xs text-emerald-300">Approved accounts</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs text-white/55">Recruiter Growth</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.recruiterUsers}</p>
            <p className="mt-2 text-xs text-emerald-300">Recruiter accounts</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs text-white/55">Suspended Accounts</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.suspendedUsers}</p>
            <p className="mt-2 text-xs text-white/50">Blocked by admin</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs text-white/55">New Signups (24h)</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stats.newUsers}</p>
            <p className="mt-2 text-xs text-amber-300">Fresh accounts</p>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10 bg-[#1b1b1d]">
          <div className="hidden grid-cols-[1.6fr_1.8fr_1fr_1fr_1fr_1.8fr] gap-4 border-b border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-medium text-white/65 lg:grid">
            <p>User Name</p>
            <p>Email Address</p>
            <p>Role</p>
            <p>Join Date</p>
            <p>Status</p>
            <p className="text-right">Actions</p>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-lg font-semibold text-white">No users found</p>
              <p className="mt-2 text-sm text-white/55">Try another role filter.</p>
            </div>
          ) : (
            users.map((user) => {
              const userId = String(user.id || user._id || "");
              const role = String(user.role || "seeker").toLowerCase();
              const status = getUserStatus(user);
              const suspended = Boolean(user.suspended || user.banned);
              const statusStyle = getStatusStyle(status, suspended);

              return (
                <div key={userId} className="border-b border-white/5 px-5 py-5 last:border-b-0">
                  <div className="grid gap-4 lg:grid-cols-[1.6fr_1.8fr_1fr_1fr_1fr_1.8fr] lg:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-xs font-semibold text-white/70">
                        {getInitials(user.name, user.email)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{user.name || "N/A"}</p>
                        <p className="mt-1 text-xs text-white/35 lg:hidden">{user.email || "N/A"}</p>
                      </div>
                    </div>

                    <p className="hidden text-sm text-white/65 lg:block">{user.email || "N/A"}</p>

                    <div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize ${getRoleStyle(role)}`}>
                        {role === "admin" ? <Shield className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
                        {role}
                      </span>
                    </div>

                    <p className="text-sm text-white/65">{formatDate(user.createdAt)}</p>

                    <div>
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusStyle.chip}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        {statusStyle.label}
                      </span>
                    </div>

                    <AdminUserActions
                      userId={userId}
                      userName={user.name}
                      role={role}
                      status={status}
                      suspended={suspended}
                    />
                  </div>
                </div>
              );
            })
          )}

          <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {users.length === 0 ? 0 : 1} to {users.length} of {users.length} users
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 font-semibold text-[#111114]">1</span>
              <span>2</span>
              <span>3</span>
              <span>...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
