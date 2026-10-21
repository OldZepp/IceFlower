"use client";

import { useEffect } from "react";
import { useActionState } from "react";
import {
  createTaskAction,
  updateTaskAction,
  type TaskFormState,
} from "@/app/(app)/tasks/actions";
import { PRIORITIES, TASK_STATUSES } from "@/lib/constants";

type Assignee = {
  id: string;
  name: string;
  position: string | null;
};

export type TaskFormInitial = {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  deadline?: string;
  tags?: string;
  links?: string;
};

const inputClass =
  "w-full rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white";
const labelClass = "text-sm font-medium text-graphite dark:text-white";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="text-xs font-medium text-danger" role="alert">
      {message}
    </span>
  );
}

export function TaskForm({
  mode,
  taskId,
  projectId,
  projectName,
  assignees,
  initial,
  onDone,
}: {
  mode: "create" | "edit";
  taskId?: string;
  projectId: string;
  projectName: string;
  assignees: Assignee[];
  initial?: TaskFormInitial;
  onDone?: () => void;
}) {
  const action = mode === "create" ? createTaskAction : updateTaskAction;
  const [state, formAction, pending] = useActionState<TaskFormState, FormData>(
    action,
    null,
  );

  useEffect(() => {
    if (state?.ok) onDone?.();
  }, [state, onDone]);

  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {mode === "edit" ? <input type="hidden" name="taskId" value={taskId} /> : null}
      <input type="hidden" name="projectId" value={projectId} />

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Название *</span>
        <input
          name="title"
          required
          maxLength={200}
          defaultValue={initial?.title ?? ""}
          placeholder="Что нужно сделать"
          className={inputClass}
        />
        <FieldError message={fieldErrors.title} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Описание</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
          placeholder="Детали, критерии готовности"
          className={`${inputClass} resize-y`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className={labelClass}>Проект</span>
          <p className="flex min-h-[38px] items-center rounded-md border border-graphite/10 bg-snow px-3 text-sm text-graphite dark:border-white/10 dark:bg-white/5 dark:text-white">
            {projectName}
          </p>
          <FieldError message={fieldErrors.projectId} />
        </div>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Исполнитель *</span>
          <select
            name="assigneeId"
            required
            defaultValue={initial?.assigneeId ?? ""}
            className={inputClass}
          >
            <option value="">Выберите исполнителя</option>
            {assignees.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
                {user.position ? ` — ${user.position}` : ""}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.assigneeId} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Статус *</span>
          <select
            name="status"
            required
            defaultValue={initial?.status ?? "backlog"}
            className={inputClass}
          >
            {TASK_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.status} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Приоритет *</span>
          <select
            name="priority"
            required
            defaultValue={initial?.priority ?? "medium"}
            className={inputClass}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
          <FieldError message={fieldErrors.priority} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Дедлайн</span>
          <input
            type="date"
            name="deadline"
            defaultValue={initial?.deadline ?? ""}
            className={inputClass}
          />
          <FieldError message={fieldErrors.deadline} />
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Теги</span>
        <input
          name="tags"
          defaultValue={initial?.tags ?? ""}
          placeholder="frontend, design"
          className={inputClass}
        />
        <span className="text-xs text-graphite/60 dark:text-white/50">
          Через запятую
        </span>
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Ссылки</span>
        <textarea
          name="links"
          rows={2}
          defaultValue={initial?.links ?? ""}
          placeholder="https://figma.com/…"
          className={`${inputClass} resize-y`}
        />
        <span className="text-xs text-graphite/60 dark:text-white/50">
          Несколько ссылок — через пробел или запятую
        </span>
      </label>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-medium text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2 border-t border-black/5 pt-3 dark:border-white/10">
        <button
          type="button"
          onClick={onDone}
          className="rounded-md px-4 py-2.5 text-sm font-medium text-graphite/70 transition-colors hover:text-graphite dark:text-white/70 dark:hover:text-white"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-sun px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sun/90 disabled:opacity-60"
        >
          {pending
            ? mode === "create"
              ? "Создаём…"
              : "Сохраняем…"
            : mode === "create"
              ? "Создать задачу"
              : "Сохранить"}
        </button>
      </div>
    </form>
  );
}
