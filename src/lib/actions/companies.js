'use server';

import {
  db,
  getCurrentActiveUserWithRole,
  getCurrentUserWithRole,
  makeDocumentSafe,
  toText,
} from "@/lib/database-helpers";

function buildCompanyData(companyData, recruiterId, existingCompany = null) {
  const now = new Date();

  return {
    id: existingCompany?.id || `cmp_${now.getTime()}`,
    name: toText(companyData?.name),
    industry: toText(companyData?.industry),
    websiteUrl: toText(companyData?.websiteUrl),
    location: toText(companyData?.location),
    employeeCount: toText(companyData?.employeeCount),
    description: toText(companyData?.description),
    logo: toText(companyData?.logo),
    status: existingCompany?.status || "pending",
    recruiterId,
    createdAt: existingCompany?.createdAt || now,
    updatedAt: now,
  };
}

function validateCompany(company) {
  const requiredFields = [
    "name",
    "industry",
    "location",
    "employeeCount",
    "description",
  ];
  const missingField = requiredFields.find((field) => !toText(company[field]));

  if (missingField) {
    throw new Error(`${missingField} is required.`);
  }
}

export async function createCompany(companyData) {
  const recruiter = await getCurrentActiveUserWithRole("recruiter");

  if (!recruiter) {
    throw new Error("Only active recruiters can create companies.");
  }

  const company = buildCompanyData(companyData, recruiter.id);
  validateCompany(company);

  const result = await db.collection("companies").insertOne(company);
  const savedCompany = await db.collection("companies").findOne({
    _id: result.insertedId,
  });

  return {
    success: true,
    message: "Company saved successfully.",
    company: makeDocumentSafe(savedCompany),
  };
}

export async function updateCompany(companyData) {
  const recruiter = await getCurrentActiveUserWithRole("recruiter");

  if (!recruiter) {
    throw new Error("Only active recruiters can update companies.");
  }

  const companyId = toText(companyData?.id);
  const existingCompany = await db.collection("companies").findOne({
    id: companyId,
    recruiterId: recruiter.id,
  });

  if (!existingCompany) {
    throw new Error("Company was not found.");
  }

  const company = buildCompanyData(companyData, recruiter.id, existingCompany);
  validateCompany(company);

  await db.collection("companies").updateOne(
    { _id: existingCompany._id },
    { $set: company }
  );

  const savedCompany = await db.collection("companies").findOne({
    _id: existingCompany._id,
  });

  return {
    success: true,
    message: "Company updated successfully.",
    company: makeDocumentSafe(savedCompany),
  };
}

export async function getCompanies() {
  const recruiter = await getCurrentUserWithRole("recruiter");

  if (!recruiter) {
    return [];
  }

  const companies = await db.collection("companies").find({
    recruiterId: recruiter.id,
  }).sort({
    createdAt: -1,
    _id: -1,
  }).toArray();

  return companies.map(makeDocumentSafe);
}
