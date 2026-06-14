import PricingSection from "@/Components/PricingSection";
import Link from "next/link";

const PlansPage = () => {
    return (
        <main className="min-h-screen bg-[#0f0f0f]">
            <section className="mx-auto max-w-5xl px-6 pt-12 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-purple-500">
                    Upgrade plan
                </p>
                <h1 className="mt-3 text-3xl font-bold text-white md:text-5xl">
                    Choose a plan to keep applying
                </h1>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-400">
                    Your free monthly apply limit is finished. Pick a plan below to continue.
                </p>
                <Link
                    href="/jobs"
                    className="mt-6 inline-flex rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                    Back to jobs
                </Link>
            </section>

            <PricingSection />
        </main>
    );
};

export default PlansPage;
