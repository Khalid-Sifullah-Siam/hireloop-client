"use client";

import { authClient } from "@/lib/auth-client";

import { Button } from "@heroui/react";

import Link from "next/link";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

const navLinks = [
  {
    name: "Browse Jobs",
    href: "/jobs",
  },
  {
    name: "Companies",
    href: "/companies",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const isActive = (href) => pathname === href;

  const handleSignOut = async () => {
    await authClient.signOut();

    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0B0B0F]/90 backdrop-blur-xl">

      {/* CONTAINER */}
      <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 lg:px-10">

        {/* NAVBAR */}
        <div className="flex h-20 items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-[#18181B] to-[#111114] px-6 lg:px-10 shadow-[0_8px_30px_rgb(0,0,0,0.35)]">

          {/* LEFT */}
          <div className="flex items-center">

            {/* LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2"
            >
              <h1 className="text-3xl font-black tracking-tight">
                <span className="text-[#0A84FF]">hire</span>
                <span className="text-[#FF8A00]">loop</span>
              </h1>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-6 lg:gap-10">

            {/* DESKTOP NAV */}
            <ul className="hidden items-center gap-8 lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* DIVIDER */}
            <div className="hidden h-6 w-px bg-white/10 md:block" />

            {/* AUTH SECTION */}
            {user ? (
              <div className="hidden md:flex items-center gap-4">

                <p className="text-sm font-medium text-white">
                  Hi, {user.name || user.email || 'User'}
                </p>

                <Button
                  
                  variant="danger"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                {/* SIGN IN */}
                <Link
                  href="/auth/signin"
                  className="hidden text-sm font-medium text-[#7B61FF] transition hover:text-[#9B87FF] md:block"
                >
                  Sign In
                </Link>

                {/* GET STARTED */}
                <Link
                  href="/auth/signup"
                  className="hidden items-center justify-center rounded-xl bg-[#6C5CE7] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-[#7B6EF6] md:flex"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center text-white lg:hidden"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="mt-3 rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-2xl lg:hidden">

            {/* MOBILE LINKS */}
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                      isActive(link.href)
                        ? "bg-[#1E1E24] text-white"
                        : "text-white/70 hover:bg-[#1A1A1F] hover:text-white"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* MOBILE AUTH */}
            <div className="mt-5 flex flex-col gap-3">

              {user ? (
                <>
                  <div className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white">
                    Hi, {user.name || user.email || 'User'}
                  </div>

                  <Button
                  
                  variant="danger"
                  onClick={handleSignOut}
                >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/auth/signup"
                    className="flex items-center justify-center rounded-xl bg-[#6C5CE7] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#7B6EF6]"
                  >
                    Get Started
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </div>
    </nav>
  );
}