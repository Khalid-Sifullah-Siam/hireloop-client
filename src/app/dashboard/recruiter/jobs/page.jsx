import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRecruiterJobs } from "@/lib/api/jobs";
import JobActions from "./job-actions";

const RecruiterJobs = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const recruiterId = session?.user?.role === "recruiter" ? session.user.id : "";
  const recruiterName = session?.user?.name || "Recruiter";
  const jobs = recruiterId ? await getRecruiterJobs(recruiterId) : [];

  const getStatusLabel = (status) => {
    const value = String(status || "pending").toLowerCase();

    if (value === "approved") return "Approved";
    if (value === "rejected") return "Rejected";
    if (value === "expired") return "Expired";
    return "Pending";
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        All Jobs Posted by {recruiterName}
      </h1>

      {!recruiterId ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">Please sign in as a recruiter first.</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-gray-500">No jobs found yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Company</th>
                <th className="p-3 border">Title</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Location</th>
                <th className="p-3 border">Salary</th>
                <th className="p-3 border">Deadline</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job, index) => (
                <tr key={job._id}>
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{job.companyName || "N/A"}</td>
                  <td className="p-3 border">{job.title}</td>
                  <td className="p-3 border">{job.category}</td>
                  <td className="p-3 border">{job.jobType}</td>
                  <td className="p-3 border">{getStatusLabel(job.status)}</td>
                  <td className="p-3 border">{job.location}</td>
                  <td className="p-3 border">{job.salaryText}</td>
                  <td className="p-3 border">{job.deadlineText}</td>
                  <td className="p-3 border">{job.createdAtText}</td>
                      <td className="p-3 border">
                        <JobActions job={job} />
                      </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;
