import StatsSection from "@/Components/StatsSection";
import LastStatsSection from "@/Components/LastStatsSection";
import FindSection from "@/Components/FindSection";
import Features from "@/Components/Features";
import PricingSection from "@/Components/PricingSection";


export default function Home() {
  return (
    <div>
      <FindSection />
      <StatsSection />
      <Features />
      <PricingSection />
      <LastStatsSection />
    </div>
  );
}
