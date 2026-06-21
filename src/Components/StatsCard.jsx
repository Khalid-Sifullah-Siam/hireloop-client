// components/StatsCard.jsx
"use client";

import { Card } from "@heroui/react";

export default function StatsCard({ icon: Icon, title, value }) {
  return (
    <Card
      view="outlined"
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-sm"
    >
      <div className="flex flex-col gap-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 to-sky-500/20 ring-1 ring-white/10">
          {Icon ? <Icon size={20} className="text-white" aria-hidden="true" /> : null}
        </div>

        <div>
          <p className="text-sm font-medium text-white/65">{title}</p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </h2>
        </div>
      </div>
    </Card>
  );
}
