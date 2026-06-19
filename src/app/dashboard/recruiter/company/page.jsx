"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { createCompany, getCompanies, updateCompany } from "@/lib/actions/companies";
import { authClient } from "@/lib/auth-client";
import {
  BadgeCheck,
  Building2,
  ChevronDown,
  Globe2,
  MapPin,
  Pencil,
  Plus,
  Sparkles,
  Upload,
  X,
} from "lucide-react";

const STORAGE_KEY = "hireloop-recruiter-companies";
const IMAGE_UPLOAD_API_KEY = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

const employeeOptions = [
  "1-10 employees",
  "11-50 employees",
  "51-200 employees",
  "201-500 employees",
  "500+ employees",
];

const industryOptions = [
  "Technology",
  "Design",
  "Marketing",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Other",
];

const emptyDraft = {
  name: "",
  industry: "Technology",
  websiteUrl: "",
  location: "",
  employeeCount: "1-10 employees",
  description: "",
  logo: "",
};

function getStatusInfo(status) {
  if (status === "approved") {
    return {
      label: "Approved",
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
      icon: BadgeCheck,
    };
  }

  if (status === "rejected") {
    return {
      label: "Rejected",
      className: "border-rose-500/30 bg-rose-500/10 text-rose-300",
      icon: X,
    };
  }

  return {
    label: "Pending",
    className: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    icon: Sparkles,
  };
}

function getStorageKey(userId) {
  return userId ? `${STORAGE_KEY}:${userId}` : STORAGE_KEY;
}

function readCompaniesFromStorage(userId) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedValue = window.localStorage.getItem(getStorageKey(userId));

    if (!savedValue) {
      return [];
    }

    const parsedValue = JSON.parse(savedValue);

    if (Array.isArray(parsedValue)) {
      return parsedValue;
    }

    if (parsedValue) {
      return [parsedValue];
    }

    return [];
  } catch {
    return [];
  }
}

function saveCompaniesToStorage(userId, companies) {
  if (typeof window === "undefined" || !userId) {
    return;
  }

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(companies));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(typeof reader.result === "string" ? reader.result : "");
    };

    reader.onerror = () => {
      reject(new Error("Could not read the image file."));
    };

    reader.readAsDataURL(file);
  });
}

async function uploadCompanyLogo(file) {
  if (!IMAGE_UPLOAD_API_KEY) {
    throw new Error("NEXT_PUBLIC_IMAGE_UPLOAD_API is missing from your environment variables.");
  }

  const uploadData = new FormData();
  uploadData.append("image", file);

  const uploadResponse = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMAGE_UPLOAD_API_KEY}`,
    {
      method: "POST",
      body: uploadData,
    }
  );

  const uploadResult = await uploadResponse.json().catch(() => ({}));

  if (!uploadResponse.ok || !uploadResult?.success) {
    throw new Error(uploadResult?.error?.message || "Failed to upload company logo.");
  }

  return uploadResult?.data?.url || uploadResult?.data?.display_url || "";
}

function CompanyField({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">{label}</span>
        {hint ? <span className="text-xs text-white/40">{hint}</span> : null}
      </div>
      {children}
    </label>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/50">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.24em]">{label}</span>
      </div>
      <p className="mt-3 text-sm font-medium text-white">{value || "Not added"}</p>
    </div>
  );
}

function CompanyCard({ company }) {
  const statusInfo = getStatusInfo(company.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05]">
            {company.logo ? (
              <div className="relative h-full w-full">
                <Image
                  src={company.logo}
                  alt={`${company.name} logo`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ) : (
              <Building2 className="h-8 w-8 text-white/35" />
            )}
          </div>

          <div className="min-w-0">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.className}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {statusInfo.label}
            </div>
            <h3 className="mt-3 text-2xl font-semibold text-white">{company.name}</h3>
            <p className="mt-2 text-sm text-white/60">{company.description}</p>
          </div>
        </div>

        {typeof company.onEdit === "function" ? (
          <button
            type="button"
            onClick={() => company.onEdit(company)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <DetailItem icon={Sparkles} label="Industry" value={company.industry} />
        <DetailItem icon={MapPin} label="Location" value={company.location} />
        <DetailItem icon={Building2} label="Employee Count" value={company.employeeCount} />
        <DetailItem icon={Globe2} label="Website" value={company.websiteUrl || "Not added"} />
      </div>
    </div>
  );
}

export default function RecruiterCompany() {
  const [mounted, setMounted] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingCompanyId, setEditingCompanyId] = useState("");
  const [draftCompany, setDraftCompany] = useState(emptyDraft);
  const [logoPreview, setLogoPreview] = useState("");
  const [formKey, setFormKey] = useState(0);
  const [notice, setNotice] = useState({ text: "", type: "success" });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id || "";

  useEffect(() => {
    let isActive = true;

    const loadCompanies = async () => {
      try {
        const savedCompanies = await getCompanies();

        if (!isActive) {
          return;
        }

        if (savedCompanies.length > 0) {
          setCompanies(savedCompanies);
          saveCompaniesToStorage(userId, savedCompanies);
        } else {
          setCompanies(readCompaniesFromStorage(userId));
        }
      } catch {
        if (!isActive) {
          return;
        }

        setCompanies(readCompaniesFromStorage(userId));
      } finally {
        if (isActive) {
          setMounted(true);
        }
      }
    };

    loadCompanies();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const openCreateForm = () => {
    setFormMode("create");
    setEditingCompanyId("");
    setDraftCompany(emptyDraft);
    setLogoPreview("");
    setIsFormOpen(true);
    setFormKey((currentKey) => currentKey + 1);
    setNotice({ text: "", type: "success" });
  };

  const openEditForm = (company) => {
    setFormMode("edit");
    setEditingCompanyId(company.id || "");
    setDraftCompany({
      name: company.name || "",
      industry: company.industry || "Technology",
      websiteUrl: company.websiteUrl || "",
      location: company.location || "",
      employeeCount: company.employeeCount || "1-10 employees",
      description: company.description || "",
      logo: company.logo || "",
    });
    setLogoPreview(company.logo || "");
    setIsFormOpen(true);
    setFormKey((currentKey) => currentKey + 1);
    setNotice({ text: "", type: "success" });
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setLogoPreview("");
    setFormMode("create");
    setEditingCompanyId("");
    setNotice({ text: "", type: "success" });
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setIsUploadingLogo(true);
    setNotice({ text: "", type: "success" });

    try {
      const localPreview = await readFileAsDataUrl(file);
      setLogoPreview(localPreview);

      const uploadedLogoUrl = await uploadCompanyLogo(file);

      setDraftCompany((currentValue) => ({
        ...currentValue,
        logo: uploadedLogoUrl,
      }));
      setLogoPreview(uploadedLogoUrl);
    } catch (error) {
      setLogoPreview("");
      setNotice({
        text: error instanceof Error ? error.message : "Logo upload failed.",
        type: "error",
      });
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const industry = String(formData.get("industry") || "").trim();
    const websiteUrl = String(formData.get("websiteUrl") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const employeeCount = String(formData.get("employeeCount") || "").trim();
    const description = String(formData.get("description") || "").trim();

    if (!name || !industry || !location || !employeeCount || !description) {
      setNotice({
        text: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (isUploadingLogo) {
      setNotice({
        text: "Please wait for the logo upload to finish.",
        type: "error",
      });
      return;
    }

    const nextCompany = {
      id: formMode === "edit" ? editingCompanyId : undefined,
      name,
      industry,
      websiteUrl,
      location,
      employeeCount,
      description,
      logo: draftCompany.logo,
      status:
        formMode === "edit"
          ? companies.find((company) => company.id === editingCompanyId)?.status || "pending"
          : "pending",
    };

    setIsSavingCompany(true);
    setNotice({ text: "", type: "success" });

    try {
      const result =
        formMode === "edit"
          ? await updateCompany(nextCompany)
          : await createCompany(nextCompany);
      const savedCompany = result?.company || nextCompany;
      const nextCompanies =
        formMode === "edit"
          ? companies.map((company) => (company.id === savedCompany.id ? savedCompany : company))
          : [savedCompany, ...companies];

      setCompanies(nextCompanies);
      saveCompaniesToStorage(userId, nextCompanies);
      setIsFormOpen(false);
      toast.success(
        formMode === "edit"
          ? "Company updated successfully."
          : "Company created successfully. Status is pending."
      );
      setNotice({
        text:
          formMode === "edit"
            ? "Company updated successfully."
            : "Company registered successfully. Status is pending.",
        type: "success",
      });
    } catch (error) {
      setNotice({
        text: error instanceof Error ? error.message : "Company save failed.",
        type: "error",
      });
    } finally {
      setIsSavingCompany(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-white/60">Loading company profile...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-[32px] border border-white/10 bg-[#0b0b0f] px-4 py-6 text-white shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-[#0a84ff]/18 blur-3xl" />
        <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-[#ff8a00]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {isFormOpen ? (
          <form
            key={formKey}
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111114]/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8">
              <div>
                <h1 className="text-3xl font-semibold text-white">
                  {formMode === "edit" ? "Edit Company" : "Register New Company"}
                </h1>
                <p className="mt-2 text-sm text-white/55">
                  {formMode === "edit"
                    ? "Update the company details and save the changes."
                    : "Enter your business details to add another company to the list."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close form"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 px-6 py-6 sm:px-8 md:grid-cols-2">
              <CompanyField label="Company Name" hint="Required">
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={draftCompany.name}
                  placeholder="e.g. Acme Corp"
                  className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]"
                />
              </CompanyField>

              <CompanyField label="Industry / Category" hint="Required">
                <div className="relative mt-2">
                  <select
                    name="industry"
                    required
                    defaultValue={draftCompany.industry}
                    className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]"
                  >
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry} className="bg-[#18181d] text-white">
                        {industry}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                </div>
              </CompanyField>

              <CompanyField label="Website URL">
                <div className="mt-2 flex h-11 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
                  <div className="flex items-center border-r border-white/10 px-4 text-sm text-white/45">
                    https://
                  </div>
                  <input
                    type="text"
                    name="websiteUrl"
                    defaultValue={draftCompany.websiteUrl}
                    placeholder="www.company.com"
                    className="w-full bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>
              </CompanyField>

              <CompanyField label="Location" hint="Required">
                <div className="mt-2 flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4">
                  <MapPin className="h-4 w-4 text-white/45" />
                  <input
                    type="text"
                    name="location"
                    required
                    defaultValue={draftCompany.location}
                    placeholder="City, Country"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  />
                </div>
              </CompanyField>

              <CompanyField label="Employee Count Range" hint="Required">
                <div className="relative mt-2">
                  <select
                    name="employeeCount"
                    required
                    defaultValue={draftCompany.employeeCount}
                    className="h-11 w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 pr-10 text-sm text-white outline-none transition focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]"
                  >
                    {employeeOptions.map((employeeCount) => (
                      <option key={employeeCount} value={employeeCount} className="bg-[#18181d] text-white">
                        {employeeCount}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />
                </div>
              </CompanyField>

              <CompanyField label="Company Logo">
                <div className="mt-2 flex items-center gap-4">
                  <label className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/[0.04] text-white/60 transition hover:bg-white/[0.07]">
                    {logoPreview || draftCompany.logo ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={logoPreview || draftCompany.logo}
                          alt="Company logo preview"
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <Upload className="h-5 w-5" />
                    )}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <p className="text-sm font-medium text-white">Upload image</p>
                    <p className="text-xs text-white/45">
                      {isUploadingLogo ? "Uploading logo..." : "PNG, JPG up to 5MB"}
                    </p>
                  </div>
                </div>
              </CompanyField>

              <CompanyField label="Brief Description" hint="Required" className="md:col-span-2">
                <textarea
                  name="description"
                  required
                  defaultValue={draftCompany.description}
                  placeholder="Tell us about your company's mission and culture..."
                  className="mt-2 min-h-[120px] w-full resize-y rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#6fb7ff]/70 focus:bg-white/[0.06]"
                />
              </CompanyField>
            </div>

            {notice.text ? (
              <div
                className={`px-6 pb-2 text-sm sm:px-8 ${
                  notice.type === "error" ? "text-rose-300" : "text-emerald-300"
                }`}
              >
                {notice.text}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
              <button
                type="button"
                onClick={closeForm}
                className="h-12 rounded-xl border border-white/10 px-6 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSavingCompany}
                className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold transition ${
                  isSavingCompany
                    ? "cursor-not-allowed bg-white/60 text-[#111114]/70"
                    : "bg-white text-[#111114] hover:bg-white/90"
                }`}
              >
                {isSavingCompany ? (
                  "Saving..."
                ) : (
                  <>
                    {formMode === "edit" ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {formMode === "edit" ? "Update Company" : "Register Company"}
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#111114]/95 backdrop-blur-xl">
            <div className="flex flex-col gap-4 border-b border-white/10 px-6 py-6 sm:flex-row sm:items-start sm:justify-between sm:px-8">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
                  Recruiter Company
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-white">My Companies</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/55">
                  Add companies one by one and view only the companies created by your recruiter account.
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
              >
                <Plus className="h-4 w-4" />
                Add Company
              </button>
            </div>

            <div className="px-6 py-6 sm:px-8">
              {companies.length > 0 ? (
                <div className="grid gap-6">
                  {companies.map((company) => (
                    <CompanyCard
                      key={company._id || company.id}
                      company={{ ...company, onEdit: openEditForm }}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[24px] border border-dashed border-white/15 bg-white/[0.03] p-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/70">
                    <Building2 className="h-7 w-7" />
                  </div>

                  <h2 className="mt-5 text-2xl font-semibold text-white">No company registered yet</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                    Add your first company to start building your private company list.
                  </p>

                  <button
                    type="button"
                    onClick={openCreateForm}
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-[#111114] transition hover:bg-white/90"
                  >
                    <Plus className="h-4 w-4" />
                    Register Company
                  </button>
                </div>
              )}
            </div>

            {notice.text ? (
              <div
                className={`border-t border-white/10 px-6 py-4 text-sm sm:px-8 ${
                  notice.type === "error" ? "text-rose-300" : "text-emerald-300"
                }`}
              >
                {notice.text}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
