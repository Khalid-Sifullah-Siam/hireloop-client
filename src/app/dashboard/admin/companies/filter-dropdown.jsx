"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";

export default function FilterDropdown({ filterItems, activeFilter }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const activeItem =
    filterItems.find((item) => item.value === activeFilter) || filterItems[0];

  const handleSelect = (value) => {
    setIsOpen(false);

    if (value === "all") {
      router.push("/dashboard/admin/companies");
      return;
    }

    router.push(`/dashboard/admin/companies?status=${value}`);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.08] hover:text-white"
      >
        <Filter className="h-4 w-4" />
        {activeItem.label}
      </button>

      {isOpen ? (
        <div className="mt-3 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#18181b] p-2 shadow-2xl">
          {filterItems.map((item) => {
            const isActive = activeFilter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={`flex w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  isActive
                    ? "bg-white text-[#111114]"
                    : "text-white/75 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
