'use server';

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function toText(value) {
  return String(value || "").trim();
}

function buildCompanyData(companyData) {
  const now = new Date();
  const id = toText(companyData?.id) || `cmp_${now.getTime()}`;

  return {
    id,
    name: toText(companyData?.name),
    industry: toText(companyData?.industry),
    websiteUrl: toText(companyData?.websiteUrl),
    location: toText(companyData?.location),
    employeeCount: toText(companyData?.employeeCount),
    description: toText(companyData?.description),
    logo: toText(companyData?.logo),
    status: toText(companyData?.status) || "pending",
    recruiterId: toText(companyData?.recruiterId),
    createdAt: companyData?.createdAt ? new Date(companyData.createdAt) : now,
    updatedAt: now,
  };
}

function normalizeCompany(company) {
  return {
    ...company,
    _id: company._id.toString(),
  };
}

async function getCurrentRecruiter() {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session?.user || session.user.role !== "recruiter") {
    return null;
  }

  return session.user;
}

export async function createCompany(companyData) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can create companies.");
  }

  const company = buildCompanyData({
    ...companyData,
    recruiterId: recruiter.id,
  });
  const companiesCollection = db.collection("companies");

  const result = await companiesCollection.insertOne(company);
  const savedCompany = await companiesCollection.findOne({ _id: result.insertedId });

  return {
    success: true,
    message: "Company saved successfully.",
    company: savedCompany ? normalizeCompany(savedCompany) : company,
  };
}

export async function updateCompany(companyData) {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    throw new Error("Only recruiters can update companies.");
  }

  const company = buildCompanyData(companyData);
  const companiesCollection = db.collection("companies");

  const existingCompany = await companiesCollection.findOne({ id: company.id });

  if (!existingCompany) {
    throw new Error("Company not found.");
  }

  if (existingCompany.recruiterId && existingCompany.recruiterId !== recruiter.id) {
    throw new Error("You can only update your own companies.");
  }

  const updatedCompany = {
    ...company,
    recruiterId: existingCompany.recruiterId || recruiter.id,
    createdAt: existingCompany.createdAt || company.createdAt,
    updatedAt: new Date(),
  };

  await companiesCollection.updateOne(
    { id: company.id },
    { $set: updatedCompany }
  );

  const savedCompany = await companiesCollection.findOne({ id: company.id });

  return {
    success: true,
    message: "Company updated successfully.",
    company: savedCompany ? normalizeCompany(savedCompany) : updatedCompany,
  };
}

export async function getCompanies() {
  const recruiter = await getCurrentRecruiter();

  if (!recruiter) {
    return [];
  }

  const companiesCollection = db.collection("companies");
  const companies = await companiesCollection
    .find({ recruiterId: recruiter.id })
    .sort({ createdAt: -1 })
    .toArray();

  return companies.map(normalizeCompany);
}
