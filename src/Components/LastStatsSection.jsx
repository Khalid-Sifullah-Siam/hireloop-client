"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@heroui/react";

export default function LastStatsSection() {
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
        <div className="max-w-sm text-center">
          <p className="text-2xl font-semibold tracking-wide text-white">
            Your next role is
            <br />
            already looking for you
          </p>
          <p className="mt-6 text-sm text-white/55">
            Build a profile in three minutes. The matches start arriving
            tomorrow morning.
          </p>
        </div>

        <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            className="rounded-md bg-white px-4 py-2 text-center text-sm font-semibold text-black"
            href="/auth/signup"
          >
            Create account
          </Link>
          <Button className="rounded-md border border-violet-950 bg-transparent">
            View pricing
          </Button>
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
