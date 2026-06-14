import JobDetailsView from "@/Components/Jobs/JobDetailsView";
import { getSeekerApplications } from "@/lib/api/applications";
import { getJobById } from "@/lib/api/jobs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";

const JobDetailsPage = async ({ params }) => {
    const { id: jobId } = await params;
    const job = await getJobById(jobId);

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const user = session?.user;
    let applicationCount = 0;
    const maxApplicationsPerMonth = 3;

    if (user?.role === "seeker") {
        const applications = await getSeekerApplications(user.id);
        applicationCount = applications.length;
    }

    return (
        <main className="bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 pt-4 text-center sm:px-6 lg:px-8">
                <span className="inline-flex rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-semibold text-slate-900 shadow-sm">
                    You have applied {applicationCount} out of {maxApplicationsPerMonth} jobs
                </span>
            </div>

            {applicationCount >= maxApplicationsPerMonth ? (
                <div className="mx-auto mt-6 max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Application limit reached</h1>
                        <p className="mt-2 text-sm text-slate-600">
                            You have already applied for {maxApplicationsPerMonth} jobs this month.
                        </p>

                        <Link
                            href="/plans"
                            className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            View Plans
                        </Link>
                    </div>
                </div>
            ) : (
                <JobDetailsView
                    job={job}
                    applicationCount={applicationCount}
                    maxApplicationsPerMonth={maxApplicationsPerMonth}
                />
            )}
        </main>
    );
};

export default JobDetailsPage;
