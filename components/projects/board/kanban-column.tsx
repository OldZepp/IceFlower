"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import type { BoardTask } from "@/lib/types";
import { TaskCard } from "@/components/tasks/task-card";

export function KanbanColumn({
  status,
  label,
  tasks,
  currentUserId,
  role,
}: {
  status: string;
  label: string;
  tasks: BoardTask[];
  currentUserId: string;
  role: string;
}) {
  return (
    <section className="flex w-[280px] shrink-0 snap-start flex-col rounded-lg border border-black/5 bg-snow/70 dark:border-white/10 dark:bg-white/5">
      <header className="flex items-center justify-between gap-2 border-b border-black/5 px-3 py-2 dark:border-white/10">
        <h3 className="text-sm font-semibold text-graphite dark:text-white">
          {label}
        </h3>
        <span className="rounded-full bg-fjord/10 px-2 py-0.5 text-[11px] font-medium text-fjord dark:bg-white/10 dark:text-white/70">
          {tasks.length}
        </span>
      </header>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex max-h-[calc(100vh-320px)] min-h-[140px] flex-1 flex-col gap-2 overflow-y-auto p-2 transition-colors ${
              snapshot.isDraggingOver ? "bg-aurora/5" : ""
            }`}
          >
            {tasks.map((task, index) => {
              const canDrag =
                role === "admin" || task.assigneeId === currentUserId;
              return (
                <Draggable
                  key={task.id}
                  draggableId={task.id}
                  index={index}
                  isDragDisabled={!canDrag}
                >
                  {(dragProvided, dragSnapshot) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className={canDrag ? "" : "opacity-80"}
                      title={
                        canDrag ? undefined : "Можно менять только свои задачи"
                      }
                    >
                      <TaskCard
                        task={task}
                        dragging={dragSnapshot.isDragging}
                        canDrag={canDrag}
                        dragHandleProps={dragProvided.dragHandleProps}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </section>
  );
}
