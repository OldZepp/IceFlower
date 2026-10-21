"use client";

import { useMemo, useState, useTransition } from "react";
import { DragDropContext, type DropResult } from "@hello-pangea/dnd";
import { TASK_STATUSES } from "@/lib/constants";
import type { BoardTask } from "@/lib/types";
import { updateTaskStatusAction } from "@/app/(app)/projects/actions";
import { CreateTaskButton } from "@/components/tasks/create-task-button";
import type { AssignableUser } from "@/lib/access";
import { KanbanColumn } from "./kanban-column";

export function KanbanBoard({
  tasks,
  currentUserId,
  role,
  projectId,
  projectName,
  assignees = [],
}: {
  tasks: BoardTask[];
  currentUserId: string;
  role: string;
  projectId?: string;
  projectName?: string;
  assignees?: AssignableUser[];
}) {
  const [items, setItems] = useState<BoardTask[]>(tasks);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const grouped = useMemo(() => {
    const map: Record<string, BoardTask[]> = {};
    for (const status of TASK_STATUSES) map[status.value] = [];
    for (const task of items) {
      if (!map[task.status]) map[task.status] = [];
      map[task.status].push(task);
    }
    return map;
  }, [items]);

  function handleDragEnd(result: DropResult) {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const toStatus = destination.droppableId;
    const snapshot = items;
    setError(null);
    setItems((prev) =>
      prev.map((task) =>
        task.id === draggableId
          ? {
              ...task,
              status: toStatus,
              overdue: toStatus === "done" ? false : task.overdue,
            }
          : task,
      ),
    );

    startTransition(async () => {
      const result = await updateTaskStatusAction({
        taskId: draggableId,
        toStatus,
        projectId,
      });
      if (!result.ok) {
        setItems(snapshot);
        setError(result.error ?? "Не удалось сохранить изменения. Попробуйте ещё раз.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-graphite/60 dark:text-white/50">
          Перетащите карточку за уголок, чтобы сменить статус.
          {projectId
            ? role === "admin"
              ? " Доступны все задачи."
              : " Доступны только ваши задачи."
            : null}
        </span>

        <div className="flex items-center gap-3">
          {isPending ? (
            <span className="text-xs text-aurora" aria-live="polite">
              Сохраняем…
            </span>
          ) : null}
          {projectId ? (
            <CreateTaskButton
              projectId={projectId}
              projectName={projectName ?? ""}
              assignees={assignees}
            />
          ) : null}
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </div>
      ) : null}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex snap-x gap-4 overflow-x-auto pb-3">
          {TASK_STATUSES.map((status) => (
            <KanbanColumn
              key={status.value}
              status={status.value}
              label={status.label}
              tasks={grouped[status.value] ?? []}
              currentUserId={currentUserId}
              role={role}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
