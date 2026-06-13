import { getJobById } from "@/lib/api/jobs";
import JobDetailsView from "@/Components/Jobs/JobDetailsView";

const JobDetailsPage = async ({ params }) => {
    const { id: jobId } = await params;
    const job = await getJobById(jobId);

    return <JobDetailsView job={job} />;
};

export default JobDetailsPage;
