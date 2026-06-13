import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getRecruiterJobs } from "@/lib/api/jobs";
import { Pencil, Trash2 } from "lucide-react";

const RecruiterJobs = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  const recruiterId = session?.user?.role === "recruiter" ? session.user.id : "";
  const recruiterName = session?.user?.name || "Recruiter";
  const jobs = recruiterId ? await getRecruiterJobs(recruiterId) : [];

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
                  <td className="p-3 border">{job.status}</td>
                  <td className="p-3 border">{job.location}</td>
                  <td className="p-3 border">{job.salaryText}</td>
                  <td className="p-3 border">{job.deadlineText}</td>
                  <td className="p-3 border">{job.createdAtText}</td>
                  <td className="p-3 border">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Edit job"
                        title="Edit job"
                        className="rounded-md border border-blue-200 p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label="Delete job"
                        title="Delete job"
                        className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
