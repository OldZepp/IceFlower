"use client";

import { useState } from "react";
import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { NavLinks } from "./nav-links";
import { GlobalSearch } from "../search/global-search";

export function Hamburger({
  children,
  notifications,
}: {
  children?: React.ReactNode;
  notifications?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-black/5 bg-snow px-3 dark:border-white/10 dark:bg-fjord">
        <button
          type="button"
          aria-label="Открыть меню"
          onClick={() => setOpen(true)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground hover:bg-black/5 dark:hover:bg-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <rect x="2" y="4" width="16" height="2" rx="1" />
            <rect x="2" y="9" width="16" height="2" rx="1" />
            <rect x="2" y="14" width="16" height="2" rx="1" />
          </svg>
        </button>
        <Logo variant="light" height={26} className="dark:hidden" />
        <Logo variant="dark" height={26} className="hidden dark:block" />
        {notifications ?? <div className="w-9" />}
      </header>

      {open && (
        <div className="md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 z-50 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-fjord text-white">
            <div className="flex h-14 items-center justify-between px-4 border-b border-white/10">
              <Logo variant="dark" height={28} />
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/90 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="border-b border-white/10 px-3 py-2">
              <GlobalSearch />
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="border-t border-white/10 py-2">
              {children}
              <ThemeToggle className="mx-3 justify-start text-white/90 hover:bg-white/10 hover:text-white focus-visible:ring-white/40" />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}