"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import type { AssignableUser } from "@/lib/access";

export function CreateTaskButton({
  projectId,
  projectName,
  assignees,
}: {
  projectId: string;
  projectName: string;
  assignees: AssignableUser[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-sun px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-sun/90"
      >
        Создать задачу
      </button>

      <Dialog open={open} onClose={() => setOpen(false)} title="Новая задача">
        <TaskForm
          mode="create"
          projectId={projectId}
          projectName={projectName}
          assignees={assignees}
          onDone={() => setOpen(false)}
        />
      </Dialog>
    </>
  );
}
