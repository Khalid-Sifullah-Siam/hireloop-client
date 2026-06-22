import { getAllJobs } from "@/lib/api/jobs";
import JobsClient from "./jobs-client";


const JobsPage = async ({ searchParams }) => {
    const jobs = await getAllJobs();
    const params = await searchParams;

    return (
        <JobsClient jobs={jobs} initialSearchParams={params} />
    );
};

export default JobsPage;
