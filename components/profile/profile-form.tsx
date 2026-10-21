"use client";

import { useActionState } from "react";
import {
  updateProfileAction,
  type ProfileState,
} from "@/app/(app)/profile/actions";

const inputClass =
  "w-full rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 disabled:opacity-60 dark:border-white/20 dark:bg-graphite dark:text-white";

export function ProfileForm({
  name,
  position,
  email,
  role,
}: {
  name: string;
  position: string;
  email: string;
  role: string;
}) {
  const [state, formAction, pending] = useActionState<
    ProfileState,
    FormData
  >(updateProfileAction, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-4 shadow-sm md:p-5 dark:border-white/10 dark:bg-graphite"
    >
      <h2 className="font-heading text-base font-semibold text-graphite dark:text-white">
        Данные профиля
      </h2>

      <label className="flex flex-col gap-1 text-sm font-medium text-graphite dark:text-white">
        Имя
        <input
          name="name"
          defaultValue={name}
          required
          maxLength={100}
          className={inputClass}
        />
        {state?.fieldErrors?.name ? (
          <span className="text-xs font-medium text-danger">
            {state.fieldErrors.name}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-graphite dark:text-white">
        Должность
        <input
          name="position"
          defaultValue={position}
          maxLength={100}
          placeholder="Например, Дизайнер"
          className={inputClass}
        />
        {state?.fieldErrors?.position ? (
          <span className="text-xs font-medium text-danger">
            {state.fieldErrors.position}
          </span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-graphite dark:text-white">
        Email
        <input
          value={email}
          readOnly
          disabled
          className={inputClass}
        />
        <span className="text-xs font-normal text-graphite/50 dark:text-white/40">
          Меняет администратор через базу данных
        </span>
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium text-graphite dark:text-white">
        Роль
        <input
          value={role === "admin" ? "Администратор" : "Сотрудник"}
          readOnly
          disabled
          className={inputClass}
        />
        <span className="text-xs font-normal text-graphite/50 dark:text-white/40">
          Меняет администратор
        </span>
      </label>

      <div className="mt-1 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-sun px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sun/90 disabled:opacity-60"
        >
          {pending ? "Сохраняем…" : "Сохранить"}
        </button>
        {state?.ok ? (
          <span className="text-xs font-medium text-aurora">
            Профиль сохранён
          </span>
        ) : null}
        {state?.error ? (
          <span role="alert" className="text-xs font-medium text-danger">
            {state.error}
          </span>
        ) : null}
      </div>
    </form>
  );
}
