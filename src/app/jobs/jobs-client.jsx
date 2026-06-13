"use client";

import { useMemo, useState } from "react";
import JobCard from "@/Components/Jobs/JobCard";

const statusOptions = ["All", "active", "inactive", "closed", "draft"];

const jobTypeOptions = [
    "All",
    "Full-time",
    "Part-time",
    "Remote",
    "Contract",
    "Internship",
];

const workModeOptions = ["All", "Remote", "On-site", "Hybrid"];

const JobsClient = ({ jobs }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("All");
    const [selectedJobType, setSelectedJobType] = useState("All");
    const [selectedWorkMode, setSelectedWorkMode] = useState("All");

    const filteredJobs = useMemo(() => {
        const text = searchTerm.trim().toLowerCase();

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
                selectedStatus === "All" || job.status === selectedStatus;

            const matchesJobType =
                selectedJobType === "All" || job.jobType === selectedJobType;

            const matchesWorkMode =
                selectedWorkMode === "All" ||
                (selectedWorkMode === "Remote" && isRemote) ||
                (selectedWorkMode === "Hybrid" && isHybrid) ||
                (selectedWorkMode === "On-site" && isOnSite);

            return matchesSearch && matchesStatus && matchesJobType && matchesWorkMode;
        });
    }, [jobs, searchTerm, selectedStatus, selectedJobType, selectedWorkMode]);

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Title, company, category..."
                            className="rounded-xl border border-white/10 bg-[#17171c] px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-cyan-400/40"
                        />
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                            Status
                        </span>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
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
                            value={selectedJobType}
                            onChange={(e) => setSelectedJobType(e.target.value)}
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
                            value={selectedWorkMode}
                            onChange={(e) => setSelectedWorkMode(e.target.value)}
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

                <div className="mb-6 flex items-center justify-between gap-4">
                    <p className="text-sm text-white/60">
                        Showing {filteredJobs.length} of {jobs.length} jobs
                    </p>

                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("");
                            setSelectedStatus("All");
                            setSelectedJobType("All");
                            setSelectedWorkMode("All");
                        }}
                        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/5"
                    >
                        Clear filters
                    </button>
                </div>

                {filteredJobs.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredJobs.map((job) => (
                            <JobCard key={job._id} job={job} />
                        ))}
                    </div>
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
