import StatsSection from "@/Components/StatsSection";
import LastStatsSection from "@/Components/LastStatsSection";
import FindSection from "@/Components/FindSection";
import Features from "@/Components/Features";
import PricingSection from "@/Components/PricingSection";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <FindSection />
      <StatsSection />
      <Features />
      <PricingSection currentUser={session?.user || null} />
      <LastStatsSection />
    </div>
  );
}
