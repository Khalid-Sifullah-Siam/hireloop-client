// components/StatsCard.jsx
"use client";

import { Card } from "@heroui/react";

export default function StatsCard({ icon: Icon, title, value }) {
  return (
    <Card
      view="outlined"
      className="w-full rounded-xl border-[#333] bg-[#1b1b1b] p-6"
    >
      <div className="flex flex-col gap-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#333]">
          {Icon ? <Icon size={20} className="text-gray-300" aria-hidden="true" /> : null}
        </div>

        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            {value}
          </h2>
        </div>
      </div>
    </Card>
  );
}
