import Image from "next/image";
import Link from "next/link";

const getCompaniesApiUrl = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!serverUrl) {
    throw new Error("NEXT_PUBLIC_SERVER_URL is missing from your environment variables.");
  }

  return `${serverUrl}/companies`;
};

const loadCompanies = async () => {
  const response = await fetch(getCompaniesApiUrl(), {
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
};

export default async function CompaniesPage() {
  const companies = await loadCompanies();

  return (
    <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
            Companies
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Company list</h1>
          <p className="mt-3 max-w-2xl text-sm text-white/55">
            Browse the companies recruiters have created in HireLoop.
          </p>
        </div>

        {companies.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center text-white/60">
            No companies found yet.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <article
                key={company._id || company.id}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                    {company.logo ? (
                      <div className="relative h-full w-full">
                        <Image
                          src={company.logo}
                          alt={`${company.name} logo`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <span className="text-lg font-semibold text-white/50">
                        {company.name?.slice(0, 1) || "C"}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{company.name || "Untitled company"}</h2>
                    <p className="text-sm text-white/50">
                      {company.industry || "N/A"} · {company.location || "N/A"}
                    </p>
                  </div>
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/65">
                  {company.description || "No description added."}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 text-sm text-white/50">
                  <span>{company.employeeCount || "N/A"}</span>
                  {company.websiteUrl ? (
                    <Link
                      href={company.websiteUrl.startsWith("http") ? company.websiteUrl : `https://${company.websiteUrl}`}
                      target="_blank"
                      className="text-white transition hover:text-[#0a84ff]"
                    >
                      Visit website
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
