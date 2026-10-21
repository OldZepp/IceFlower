"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DUE_FILTERS, PRIORITIES, TASK_STATUSES } from "@/lib/constants";
import type { ProjectOption } from "@/lib/my-tasks";

const ALL = "all";

type FilterState = {
  q: string;
  status: string;
  project: string;
  priority: string;
  due: string;
};

const EMPTY: FilterState = {
  q: "",
  status: ALL,
  project: ALL,
  priority: ALL,
  due: ALL,
};

function readState(params: URLSearchParams): FilterState {
  return {
    q: params.get("q") ?? "",
    status: params.get("status") ?? ALL,
    project: params.get("project") ?? ALL,
    priority: params.get("priority") ?? ALL,
    due: params.get("due") ?? ALL,
  };
}

function isSame(a: FilterState, b: FilterState): boolean {
  return (
    a.q.trim() === b.q.trim() &&
    a.status === b.status &&
    a.project === b.project &&
    a.priority === b.priority &&
    a.due === b.due
  );
}

function isActive(state: FilterState): boolean {
  return (
    state.q.trim() !== "" ||
    state.status !== ALL ||
    state.project !== ALL ||
    state.priority !== ALL ||
    state.due !== ALL
  );
}

const labelClass =
  "text-[11px] font-medium uppercase tracking-wide text-graphite/50 dark:text-white/40";
const controlClass =
  "w-full rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white";

export function MyTasksFilters({
  projects,
  count,
}: {
  projects: ProjectOption[];
  count: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<FilterState>(() =>
    readState(new URLSearchParams(searchParams.toString())),
  );
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const urlKey = searchParams.toString();

  const [prevUrlKey, setPrevUrlKey] = useState(urlKey);
  if (urlKey !== prevUrlKey) {
    setPrevUrlKey(urlKey);
    const fromUrl = readState(new URLSearchParams(urlKey));
    setState((prev) => (isSame(prev, fromUrl) ? prev : fromUrl));
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function commit(next: FilterState) {
    const params = new URLSearchParams();
    if (next.q.trim()) params.set("q", next.q.trim());
    if (next.status !== ALL) params.set("status", next.status);
    if (next.project !== ALL) params.set("project", next.project);
    if (next.priority !== ALL) params.set("priority", next.priority);
    if (next.due !== ALL) params.set("due", next.due);
    if (searchParams.get("view") === "board") params.set("view", "board");

    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `${pathname}?${search}` : pathname, {
        scroll: false,
      });
    });
  }

  function applyNow(patch: Partial<FilterState>) {
    if (timerRef.current) clearTimeout(timerRef.current);
    const next = { ...state, ...patch };
    setState(next);
    commit(next);
  }

  function changeQuery(value: string) {
    const next = { ...state, q: value };
    setState(next);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => commit(next), 300);
  }

  function reset() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setState(EMPTY);
    commit(EMPTY);
  }

  return (
    <section className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-graphite">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1 sm:col-span-2 lg:col-span-1">
          <span className={labelClass}>Поиск</span>
          <input
            type="search"
            value={state.q}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Название задачи"
            className={controlClass}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Статус</span>
          <select
            value={state.status}
            onChange={(event) => applyNow({ status: event.target.value })}
            className={controlClass}
          >
            <option value={ALL}>Все статусы</option>
            {TASK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Проект</span>
          <select
            value={state.project}
            onChange={(event) => applyNow({ project: event.target.value })}
            className={controlClass}
          >
            <option value={ALL}>Все проекты</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Приоритет</span>
          <select
            value={state.priority}
            onChange={(event) => applyNow({ priority: event.target.value })}
            className={controlClass}
          >
            <option value={ALL}>Все приоритеты</option>
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Срок</span>
          <select
            value={state.due}
            onChange={(event) => applyNow({ due: event.target.value })}
            className={controlClass}
          >
            {DUE_FILTERS.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-black/5 pt-3 dark:border-white/10">
        <label className="flex items-center gap-2 text-sm text-graphite/80 dark:text-white/70">
          <input
            type="checkbox"
            checked={state.due === "overdue"}
            onChange={(event) =>
              applyNow({ due: event.target.checked ? "overdue" : ALL })
            }
            className="h-4 w-4 accent-aurora"
          />
          Только просроченные
        </label>

        <div className="flex items-center gap-3">
          <span className="text-xs text-graphite/60 dark:text-white/50">
            {isPending ? "Обновляем…" : `Найдено: ${count}`}
          </span>
          {isActive(state) ? (
            <button
              type="button"
              onClick={reset}
              className="rounded-md border border-aurora px-3 py-1.5 text-xs font-medium text-aurora transition-colors hover:bg-aurora/10"
            >
              Сбросить
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
