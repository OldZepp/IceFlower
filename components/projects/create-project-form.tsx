"use client";

import { useActionState } from "react";
import {
  createProjectAction,
  type CreateProjectState,
} from "@/app/(app)/projects/actions";
import { PROJECT_STATUSES } from "@/lib/constants";

type UserOption = {
  id: string;
  name: string;
  position: string | null;
  email: string;
};

const inputClass =
  "w-full rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white";
const labelClass = "text-sm font-medium text-graphite dark:text-white";

export function CreateProjectForm({ users }: { users: UserOption[] }) {
  const [state, formAction, pending] = useActionState<
    CreateProjectState,
    FormData
  >(createProjectAction, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-graphite"
    >
      <label className="flex flex-col gap-1">
        <span className={labelClass}>Название *</span>
        <input name="name" required maxLength={120} placeholder="Название проекта" className={inputClass} />
      </label>

      <label className="flex flex-col gap-1">
        <span className={labelClass}>Описание</span>
        <textarea
          name="description"
          rows={3}
          maxLength={600}
          placeholder="Что делаем и зачем"
          className={`${inputClass} resize-y`}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Руководитель *</span>
          <select name="leadId" required className={inputClass}>
            <option value="">Выберите руководителя</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Статус</span>
          <select name="status" defaultValue="planning" className={inputClass}>
            {PROJECT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Дата старта</span>
          <input type="date" name="startDate" className={inputClass} />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Дата завершения</span>
          <input type="date" name="endDate" className={inputClass} />
        </label>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className={labelClass}>Участники</legend>
        <div className="grid gap-2 rounded-md border border-graphite/10 p-3 sm:grid-cols-2 dark:border-white/10">
          {users.map((user) => (
            <label
              key={user.id}
              className="flex cursor-pointer items-center gap-2 text-sm text-graphite dark:text-white"
            >
              <input
                type="checkbox"
                name="memberIds"
                value={user.id}
                className="h-4 w-4 accent-aurora"
              />
              <span className="truncate">
                {user.name}
                {user.position ? (
                  <span className="text-graphite/60 dark:text-white/50">
                    {" "}
                    — {user.position}
                  </span>
                ) : null}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error ? (
        <p
          role="alert"
          className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-medium text-danger"
        >
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-sun px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sun/90 disabled:opacity-60"
        >
          {pending ? "Создаём…" : "Создать проект"}
        </button>
      </div>
    </form>
  );
}
