"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { TaskForm, type TaskFormInitial } from "./task-form";
import type { AssignableUser } from "@/lib/access";

export type EditableTask = TaskFormInitial & {
  id: string;
  key: string;
  projectId: string;
};

export function EditTaskButton({
  task,
  projectName,
  assignees,
}: {
  task: EditableTask;
  projectName: string;
  assignees: AssignableUser[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-aurora px-3 py-2 text-sm font-medium text-aurora transition-colors hover:bg-aurora/10"
      >
        Редактировать
      </button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={`Задача ${task.key}`}
      >
        <TaskForm
          mode="edit"
          taskId={task.id}
          projectId={task.projectId}
          projectName={projectName}
          assignees={assignees}
          initial={task}
          onDone={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
