"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import JobCard from "@/Components/Jobs/JobCard";

const statusOptions = ["All", "approved", "pending", "expired"];
const jobTypeOptions = ["All", "Full-time", "Part-time", "Remote", "Contract", "Internship"];
const workModeOptions = ["All", "Remote", "On-site", "Hybrid"];
const jobsPerPage = 4;

function getSafeValue(value, allowedValues, fallbackValue) {
    if (!value) {
        return fallbackValue;
    }

    return allowedValues.includes(value) ? value : fallbackValue;
}

function buildQueryString(params) {
    const searchParams = new URLSearchParams();

    if (params.searchTerm) {
        searchParams.set("search", params.searchTerm);
    }

    if (params.status && params.status !== "All") {
        searchParams.set("status", params.status);
    }

    if (params.jobType && params.jobType !== "All") {
        searchParams.set("type", params.jobType);
    }

    if (params.workMode && params.workMode !== "All") {
        searchParams.set("mode", params.workMode);
    }

    if (params.page && params.page > 1) {
        searchParams.set("page", String(params.page));
    }

    const queryString = searchParams.toString();

    return queryString ? `?${queryString}` : "";
}

const JobsClient = ({ jobs, initialSearchParams }) => {
    const router = useRouter();
    const pathname = usePathname();
    const currentSearchParams = useSearchParams();

    const filters = useMemo(() => {
        const urlSearchTerm = String(currentSearchParams.get("search") ?? initialSearchParams?.search ?? "");
        const urlStatus = getSafeValue(
            String(currentSearchParams.get("status") ?? initialSearchParams?.status ?? "All"),
            statusOptions,
            "All"
        );
        const urlJobType = getSafeValue(
            String(currentSearchParams.get("type") ?? initialSearchParams?.type ?? "All"),
            jobTypeOptions,
            "All"
        );
        const urlWorkMode = getSafeValue(
            String(currentSearchParams.get("mode") ?? initialSearchParams?.mode ?? "All"),
            workModeOptions,
            "All"
        );
        const urlPage = Number.parseInt(String(currentSearchParams.get("page") ?? initialSearchParams?.page ?? "1"), 10);

        return {
            searchTerm: urlSearchTerm,
            status: urlStatus,
            jobType: urlJobType,
            workMode: urlWorkMode,
            page: Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1,
        };
    }, [currentSearchParams, initialSearchParams]);

    const filteredJobs = useMemo(() => {
        const text = filters.searchTerm.trim().toLowerCase();

        return jobs.filter((job) => {
            const locationText = job.location?.toLowerCase() || "";
            const isRemote =
                locationText.includes("remote") ||
                job.jobType?.toLowerCase() === "remote" ||
                job.isRemote === true;
            const isHybrid =
                locationText.includes("hybrid") ||
                job.jobType?.toLowerCase() === "hybrid";
            const isOnSite = !isRemote && !isHybrid;

            const matchesSearch =
                !text ||
                job.title?.toLowerCase().includes(text) ||
                job.companyName?.toLowerCase().includes(text) ||
                job.category?.toLowerCase().includes(text) ||
                job.location?.toLowerCase().includes(text);

            const matchesStatus =
                filters.status === "All" || job.status === filters.status;

            const matchesJobType =
                filters.jobType === "All" || job.jobType === filters.jobType;

            const matchesWorkMode =
                filters.workMode === "All" ||
                (filters.workMode === "Remote" && isRemote) ||
                (filters.workMode === "Hybrid" && isHybrid) ||
                (filters.workMode === "On-site" && isOnSite);

            return matchesSearch && matchesStatus && matchesJobType && matchesWorkMode;
        });
    }, [filters.jobType, filters.searchTerm, filters.status, filters.workMode, jobs]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));
    const currentPage = Math.min(filters.page, totalPages);
    const startIndex = (currentPage - 1) * jobsPerPage;
    const pageJobs = filteredJobs.slice(startIndex, startIndex + jobsPerPage);

    function updateUrl(nextValues) {
        const queryString = buildQueryString({
            searchTerm: nextValues.searchTerm ?? filters.searchTerm,
            status: nextValues.status ?? filters.status,
            jobType: nextValues.jobType ?? filters.jobType,
            workMode: nextValues.workMode ?? filters.workMode,
            page: nextValues.page ?? 1,
        });

        router.replace(`${pathname}${queryString}`, { scroll: false });
    }

    
    function handleClearFilters() {
        updateUrl({
            searchTerm: "",
            status: "All",
            jobType: "All",
            workMode: "All",
            page: 1,
        });
    }


    
    function goToPage(pageNumber) {
        const safePage = Math.min(Math.max(1, pageNumber), totalPages);

        updateUrl({ page: safePage });
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-[#111114] px-6 py-8 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-8">
                    <div className="max-w-2xl">
                        <p className="mb-3 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                            Latest openings
                        </p>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Discover jobs that match your next move
                        </h1>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                            Search by title or company, then filter by job type, location, and status.
                        </p>
                    </div>
                </div>

                <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2 lg:grid-cols-4">
                    <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                            Search
                        </span>
                        <input
                            type="text"
                            value={filters.searchTerm}
                            onChange={(e) =>
                                updateUrl({
                                    searchTerm: e.target.value,
                                    page: 1,
                                })
                            }
                            placeholder="Title, company, category..."
                            className="rounded-xl border border-white/10 bg-[#17171c] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/40"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                            Status
                        </span>
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                updateUrl({
                                    status: e.target.value,
                                    page: 1,
                                })
                            }
                            className="rounded-xl border border-white/10 bg-[#17171c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        >
                            {statusOptions.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                            Job Type
                        </span>
                        <select
                            value={filters.jobType}
                            onChange={(e) =>
                                updateUrl({
                                    jobType: e.target.value,
                                    page: 1,
                                })
                            }
                            className="rounded-xl border border-white/10 bg-[#17171c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        >
                            {jobTypeOptions.map((jobType) => (
                                <option key={jobType} value={jobType}>
                                    {jobType}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                            Work Mode
                        </span>
                        <select
                            value={filters.workMode}
                            onChange={(e) =>
                                updateUrl({
                                    workMode: e.target.value,
                                    page: 1,
                                })
                            }
                            className="rounded-xl border border-white/10 bg-[#17171c] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/40"
                        >
                            {workModeOptions.map((workMode) => (
                                <option key={workMode} value={workMode}>
                                    {workMode}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-white/60">
                        {filteredJobs.length} filtered jobs
                    </p>

                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5"
                    >
                        Clear filters
                    </button>
                </div>

                {filteredJobs.length > 0 ? (
                    <>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {pageJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>

                        {totalPages > 1 ? (
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Previous
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                    <button
                                        key={pageNumber}
                                        type="button"
                                        onClick={() => goToPage(pageNumber)}
                                        className={`min-w-11 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                            pageNumber === currentPage
                                                ? "border-cyan-400/30 bg-cyan-400/15 text-cyan-200"
                                                : "border-white/10 text-white/70 hover:bg-white/5"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next
                                </button>
                            </div>
                        ) : null}
                    </>
                ) : (
                    <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-white/70 shadow-sm">
                        No jobs matched your search and filters.
                    </div>
                )}
            </section>
        </main>
    );
};

export default JobsClient;
