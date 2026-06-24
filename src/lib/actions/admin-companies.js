'use server';

import { revalidatePath } from "next/cache";
import {
  db,
  getCurrentUserWithRole,
  getIdFilters,
  makeDocumentSafe,
} from "@/lib/database-helpers";

export async function getAdminCompanies(status = "all") {
  const admin = await getCurrentUserWithRole("admin");

  if (!admin) {
    return [];
  }

  const databaseFilter =
    status && status !== "all"
      ? { status: String(status).toLowerCase() }
      : {};
  const companies = await db
    .collection("companies")
    .find(databaseFilter)
    .sort({ createdAt: -1, _id: -1 })
    .toArray();
  const jobs = await db
    .collection("jobs")
    .find({})
    .project({ companyId: 1, company: 1 })
    .toArray();
  const users = await db
    .collection("user")
    .find({})
    .project({ id: 1, email: 1 })
    .toArray();
  const emailByUserId = new Map();

  for (const user of users) {
    emailByUserId.set(user._id.toString(), user.email || "");

    if (user.id) {
      emailByUserId.set(String(user.id), user.email || "");
    }
  }

  return companies.map((company) => {
    const companyId = String(company.id || company._id);
    const jobsCount = jobs.filter((job) => {
      const jobCompanyId = String(job.companyId || job.company?.id || "");
      return jobCompanyId === companyId;
    }).length;

    return {
      ...makeDocumentSafe(company),
      id: companyId,
      jobsCount,
      recruiterEmail:
        emailByUserId.get(String(company.recruiterId || "")) || "N/A",
    };
  });
}

export async function updateAdminCompanyStatus(formData) {
  const admin = await getCurrentUserWithRole("admin");

  if (!admin) {
    throw new Error("Only admins can update company status.");
  }

  const companyId = String(formData.get("companyId") || "").trim();
  const status = String(formData.get("status") || "").trim().toLowerCase();

  if (!companyId || !status) {
    throw new Error("Company id and status are required.");
  }

  if (!["pending", "approved", "rejected"].includes(status)) {
    throw new Error("Invalid company status.");
  }

  const companyFilter = { $or: getIdFilters(companyId) };
  const result = await db.collection("companies").updateOne(
    companyFilter,
    {
      $set: {
        status,
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Company was not found.");
  }

  const updatedCompany = await db.collection("companies").findOne(companyFilter);

  revalidatePath("/dashboard/admin/companies");
  revalidatePath("/companies");

  return {
    message: "Company status updated successfully.",
    company: makeDocumentSafe(updatedCompany),
  };
}
