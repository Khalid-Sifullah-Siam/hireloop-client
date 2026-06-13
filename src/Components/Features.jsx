import { Card } from "@heroui/react";

const features = [
  {
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
    badge: "AI",
  },
  {
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
    badge: "$",
  },
  {
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
    badge: "CO",
  },
  {
    title: "Saved Jobs",
    description: "Manage applications and favorites from your dashboard.",
    badge: "SAVE",
  },
  {
    title: "One-Click Apply",
    description: "Simplify your applications with a faster apply flow.",
    badge: "1X",
  },
  {
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
    badge: "CV",
  },
  {
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
    badge: "FIT",
  },
  {
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
    badge: "UP",
  },
];

export default function Features() {
  return (
    <section className="bg-[#0f0f0f] px-6 py-20">
      <div className="mx-auto max-w-6xl text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-purple-500">
          Features
        </p>
        <h2 className="mb-16 text-4xl font-bold text-white md:text-5xl">
          Everything you need to succeed
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border border-gray-800 bg-[#1a1a1a] p-4 transition-colors hover:border-purple-500"
            >
              <div className="text-left">
                <div className="mb-3 inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                  {feature.badge}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
