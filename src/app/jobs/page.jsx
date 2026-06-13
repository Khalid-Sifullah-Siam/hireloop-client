import { getAllJobs } from "@/lib/api/jobs";
import JobsClient from "./jobs-client";


const JobsPage = async () => {
    const jobs = await getAllJobs();

    return (
        <JobsClient jobs={jobs} />
    );
};

export default JobsPage;
