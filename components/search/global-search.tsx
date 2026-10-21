"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { searchAction, type SearchResults } from "@/app/(app)/search/actions";

const EMPTY: SearchResults = { projects: [], tasks: [] };

export function GlobalSearch({ className = "" }: { className?: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const ready = trimmed.length >= 2;
  const hasResults = results.projects.length > 0 || results.tasks.length > 0;

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true);
      searchAction(trimmed)
        .then((res) => {
          if (!cancelled) setResults(res);
        })
        .catch(() => {
          if (!cancelled) setResults(EMPTY);
        })
        .finally(() => {
          if (!cancelled) setSearching(false);
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [trimmed, ready]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          setOpen(true);
          if (value.trim().length < 2) {
            setResults(EMPTY);
            setSearching(false);
          }
        }}
        onFocus={() => setOpen(true)}
        placeholder="Поиск проектов и задач"
        aria-label="Поиск проектов и задач"
        className="w-full rounded-md border border-white/10 bg-white/10 py-2 pl-9 pr-3 text-sm text-white outline-none transition-colors placeholder:text-white/50 focus:border-aurora"
      />

      {open && ready ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-graphite">
          {searching ? (
            <p className="px-3 py-3 text-sm text-graphite/60 dark:text-white/60">
              Ищем…
            </p>
          ) : !hasResults ? (
            <p className="px-3 py-3 text-sm text-graphite/60 dark:text-white/60">
              Ничего не найдено
            </p>
          ) : (
            <>
              {results.projects.length > 0 ? (
                <div>
                  <p className="bg-snow px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-graphite/60 dark:bg-white/5 dark:text-white/50">
                    Проекты
                  </p>
                  {results.projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm text-graphite transition-colors hover:bg-snow dark:text-white dark:hover:bg-white/5"
                    >
                      {project.name}
                    </Link>
                  ))}
                </div>
              ) : null}
              {results.tasks.length > 0 ? (
                <div>
                  <p className="bg-snow px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-graphite/60 dark:bg-white/5 dark:text-white/50">
                    Задачи
                  </p>
                  {results.tasks.map((task) => (
                    <Link
                      key={task.id}
                      href={`/tasks/${task.id}`}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm text-graphite transition-colors hover:bg-snow dark:text-white dark:hover:bg-white/5"
                    >
                      <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-graphite/50 dark:text-white/40">
                        {task.key}
                      </span>
                      {task.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
