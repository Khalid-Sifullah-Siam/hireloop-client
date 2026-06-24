"use client";

import Image from "next/image";
import { Card } from "@heroui/react";
import { BriefcaseFill, Factory, PersonFill, Star } from "@gravity-ui/icons";

const statIcons = [BriefcaseFill, Factory, PersonFill, Star];

export default function StatsSection({ stats = [] }) {
  const visibleStats = stats.map((stat, index) => ({
    ...stat,
    icon: statIcons[index] || Star,
  }));
  const jobSeekerCount =
    stats.find((stat) => stat.label === "Job Seekers")?.value || "0";

  return (
    <section className="relative flex min-h-[520px] w-full flex-col items-center justify-center overflow-hidden bg-[#0a0a0f] py-28">
      <div className="pointer-events-none absolute inset-0 flex select-none items-start justify-center">
        <Image
          alt="Decorative globe"
          className="w-full max-w-[780px] object-contain opacity-80"
          height={653}
          src="/images/globe.png"
          style={{
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0) 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 40%, rgba(0,0,0,0) 100%)",
          }}
          width={780}
        />
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[320px] w-[520px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(120, 60, 220, 0.38) 0%, rgba(80, 30, 160, 0.18) 50%, transparent 80%)",
          filter: "blur(18px)",
          zIndex: 1,
        }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-4 pb-12 pt-44">
        <p className="max-w-sm text-center text-2xl font-light tracking-wide text-white/80">
          Assisting{" "}
          <span className="font-semibold text-white">{jobSeekerCount} job seekers</span>
          <br />
          find their dream positions.
        </p>

        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {visibleStats.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{
          background: "linear-gradient(to top, #0a0a0f 0%, transparent 100%)",
        }}
      />
    </section>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <Card
      className={{
        base: "rounded-2xl border border-white/[0.08] shadow-lg backdrop-blur-md",
      }}
      style={{
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)",
      }}
    >
      <div className="flex flex-col gap-3 p-4">
        <Icon className="h-5 w-5 text-white/50" />
        <div>
          <p className="text-3xl font-bold leading-none tracking-tight text-white">
            {stat.value}
          </p>
          <p className="mt-1 text-xs font-medium tracking-wide text-white/40">
            {stat.label}
          </p>
        </div>
      </div>
    </Card>
  );
}
