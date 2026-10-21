"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

export function Dialog({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };
    el.addEventListener("cancel", handleCancel);
    return () => el.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="w-[min(34rem,calc(100vw-2rem))] rounded-lg border border-black/5 bg-white p-0 text-graphite shadow-xl backdrop:bg-fjord/60 dark:border-white/10 dark:bg-graphite dark:text-white max-sm:m-0 max-sm:h-dvh max-sm:max-h-none max-sm:w-screen max-sm:max-w-none max-sm:rounded-none"
    >
      <div className="flex max-h-[85dvh] flex-col max-sm:h-dvh max-sm:max-h-none">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-black/5 px-4 py-3 dark:border-white/10">
          <h2 className="font-heading text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded p-1 text-graphite/60 transition-colors hover:text-graphite dark:text-white/60 dark:hover:text-white"
          >
            <CloseIcon />
          </button>
        </header>
        <div className="overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </dialog>
  );
}
