"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  markAllReadAction,
  markReadAction,
} from "@/app/(app)/notifications/actions";
import { formatDateTime } from "@/lib/format";
import type { NotificationItem } from "@/lib/notifications";

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" />
    </svg>
  );
}

export function Bell({
  items,
  unread,
  className = "",
}: {
  items: NotificationItem[];
  unread: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [list, setList] = useState<NotificationItem[]>(items);
  const [count, setCount] = useState(unread);
  const [synced, setSynced] = useState({ items, unread });
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  if (synced.items !== items || synced.unread !== unread) {
    setSynced({ items, unread });
    setList(items);
    setCount(unread);
  }

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  async function openItem(item: NotificationItem) {
    setOpen(false);
    if (!item.read) {
      setList((prev) =>
        prev.map((row) => (row.id === item.id ? { ...row, read: true } : row)),
      );
      setCount((prev) => Math.max(0, prev - 1));
      await markReadAction(item.id);
    }
    router.push(`/tasks/${item.taskId}`);
  }

  async function readAll() {
    setList((prev) => prev.map((row) => ({ ...row, read: true })));
    setCount(0);
    await markAllReadAction();
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={
          count > 0
            ? `Уведомления: непрочитанных ${count}`
            : "Уведомления"
        }
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 ${className}`}
      >
        <BellIcon />
        {count > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sun px-1 text-[10px] font-semibold leading-none text-white">
            {count > 99 ? "99+" : count}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-lg border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-graphite">
          <div className="flex items-center justify-between border-b border-black/5 px-3 py-2 dark:border-white/10">
            <span className="text-sm font-semibold text-graphite dark:text-white">
              Уведомления
            </span>
            {count > 0 ? (
              <button
                type="button"
                onClick={readAll}
                className="text-xs font-medium text-aurora transition-colors hover:underline"
              >
                Прочитать всё
              </button>
            ) : null}
          </div>

          <ul className="max-h-80 overflow-y-auto">
            {list.length === 0 ? (
              <li className="px-3 py-5 text-center text-sm text-graphite/60 dark:text-white/60">
                Новых уведомлений нет
              </li>
            ) : null}
            {list.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openItem(item)}
                  className={`w-full border-b border-black/5 px-3 py-2.5 text-left transition-colors last:border-0 hover:bg-snow dark:border-white/10 dark:hover:bg-white/5 ${
                    item.read ? "opacity-70" : ""
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 shrink-0 rounded-full ${
                        item.read
                          ? "bg-graphite/20 dark:bg-white/20"
                          : "bg-sun"
                      }`}
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-graphite/60 dark:text-white/60">
                      {item.type === "assigned"
                        ? "Назначена задача"
                        : "Новый комментарий"}
                    </span>
                  </span>
                  <span className="mt-1 block truncate text-sm font-medium text-graphite dark:text-white">
                    {item.taskKey} · {item.taskTitle}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-graphite/50 dark:text-white/40">
                    {formatDateTime(item.createdAt)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
