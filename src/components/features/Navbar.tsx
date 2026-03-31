"use client";

import Link from "next/link";
import { useState } from "react";

import { activityCards } from "@/utils/activityCards";

type NavbarProps = {
  siteTitle: string;
};

export default function Navbar({ siteTitle }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-5 py-4 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <nav className="relative">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-[rgba(255,220,240,0.2)] bg-[rgba(255,227,243,0.12)] px-4 py-2 text-sm font-semibold tracking-[0.12em] text-[#fff0fb] transition hover:border-[rgba(255,220,240,0.34)] hover:bg-[rgba(255,227,243,0.18)]"
            >
              {siteTitle}
            </Link>

            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls="primary-navigation"
              aria-label={
                isOpen ? "Close navigation menu" : "Open navigation menu"
              }
              onClick={() => setIsOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,220,240,0.16)] bg-[rgba(255,232,245,0.08)] text-[#fff0fb] transition hover:border-[rgba(255,220,240,0.3)] hover:bg-[rgba(255,232,245,0.14)]"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="relative block h-4 w-5">
                <span
                  className={[
                    "absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-transform duration-200",
                    isOpen
                      ? "translate-y-[7px] rotate-45"
                      : "translate-y-0 rotate-0",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-opacity duration-200",
                    isOpen ? "opacity-0" : "opacity-100",
                  ].join(" ")}
                />
                <span
                  className={[
                    "absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-200",
                    isOpen
                      ? "-translate-y-[7px] -rotate-45"
                      : "translate-y-0 rotate-0",
                  ].join(" ")}
                />
              </span>
            </button>
          </div>

          <div
            id="primary-navigation"
            className={[
              "grid overflow-hidden transition-all duration-200 ease-out",
              isOpen
                ? "mt-4 grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0",
            ].join(" ")}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2">
                {activityCards.map((activity) => (
                  <Link
                    key={activity.id}
                    href={activity.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-[rgba(255,220,240,0.16)] bg-[rgba(255,232,245,0.08)] px-4 py-3 text-sm font-medium text-[rgba(255,232,245,0.92)] transition hover:border-[rgba(255,220,240,0.3)] hover:bg-[rgba(255,232,245,0.14)]"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(255,220,240,0.16)] bg-[rgba(255,232,245,0.1)] text-base">
                        {activity.icon}
                      </span>
                      <span>{activity.title}</span>
                    </span>
                    <span className="text-xs uppercase tracking-[0.16em] text-[rgba(255,220,240,0.74)]">
                      Open
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
