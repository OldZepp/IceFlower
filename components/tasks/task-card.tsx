import Link from "next/link";
import type { DraggableProvidedDragHandleProps } from "@hello-pangea/dnd";
import type { BoardTask } from "@/lib/types";
import { Avatar } from "@/components/avatar";
import { PriorityBadge } from "./priority-badge";
import { GripIcon } from "@/components/icons";

export function TaskCard({
  task,
  dragging = false,
  canDrag = true,
  dragHandleProps,
}: {
  task: BoardTask;
  dragging?: boolean;
  canDrag?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}) {
  const border = task.overdue
    ? "border-danger ring-1 ring-danger/40"
    : "border-black/5 dark:border-white/10";

  return (
    <div
      className={`rounded-md border bg-white p-3 text-graphite shadow-sm transition-shadow dark:bg-graphite dark:text-white ${border} ${
        dragging ? "shadow-lg" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/tasks/${task.id}`}
          className="text-[11px] font-semibold uppercase tracking-wide text-graphite/50 transition-colors hover:text-aurora dark:text-white/50"
        >
          {task.key}
        </Link>

        <div className="flex items-center gap-1">
          <PriorityBadge value={task.priority} />
          {canDrag ? (
            <button
              type="button"
              aria-label="Перетащить задачу"
              {...(dragHandleProps ?? {})}
              className={`touch-none rounded p-1 transition-colors ${
                dragging
                  ? "text-aurora"
                  : "text-graphite/40 hover:text-graphite dark:text-white/40 dark:hover:text-white"
              }`}
            >
              <GripIcon />
            </button>
          ) : null}
        </div>
      </div>

      <Link
        href={`/tasks/${task.id}`}
        className="mt-2 block text-sm font-medium leading-snug transition-colors hover:text-aurora"
      >
        {task.title}
      </Link>

      {task.projectName ? (
        <p className="mt-1 truncate text-[11px] text-graphite/50 dark:text-white/40">
          {task.projectName}
        </p>
      ) : null}

      {task.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-fjord/5 px-1.5 py-0.5 text-[10px] text-fjord/70 dark:bg-white/10 dark:text-white/60"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2">
        {task.assigneeInitials ? (
          <Avatar label={task.assigneeInitials} size="xs" />
        ) : (
          <span className="text-[11px] text-graphite/50 dark:text-white/40">
            Не назначен
          </span>
        )}

        {task.deadlineLabel ? (
          <span
            className={`inline-flex items-center gap-1 text-[11px] ${
              task.overdue
                ? "font-medium text-danger"
                : "text-graphite/60 dark:text-white/50"
            }`}
          >
            {task.overdue ? <span aria-hidden>!</span> : null}
            {task.deadlineLabel}
          </span>
        ) : null}
      </div>
    </div>
  );
}
