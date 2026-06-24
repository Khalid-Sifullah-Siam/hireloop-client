import StatsSection from "@/Components/StatsSection";
import LastStatsSection from "@/Components/LastStatsSection";
import FindSection from "@/Components/FindSection";
import Features from "@/Components/Features";
import PricingSection from "@/Components/PricingSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getPlatformStats } from "@/lib/api/stats";


export default async function Home() {
  const [session, platformStats] = await Promise.all([
    auth.api.getSession({
      headers: await headers(),
    }),
    getPlatformStats(),
  ]);

  return (
    <div>
      <FindSection />
      <StatsSection stats={platformStats} />
      <Features />
      <PricingSection currentUser={session?.user || null} />
      <LastStatsSection />
    </div>
  );
}
