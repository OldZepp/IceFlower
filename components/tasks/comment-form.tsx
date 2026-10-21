"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import {
  addCommentAction,
  type CommentState,
} from "@/app/(app)/tasks/actions";

export function CommentForm({ taskId }: { taskId: string }) {
  const [state, formAction, pending] = useActionState<CommentState, FormData>(
    addCommentAction,
    null,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok && ref.current) ref.current.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="taskId" value={taskId} />
      <textarea
        name="text"
        required
        rows={3}
        maxLength={2000}
        placeholder="Написать комментарий"
        className="w-full resize-y rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none transition-colors focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white"
      />
      {state?.error ? (
        <span role="alert" className="text-xs font-medium text-danger">
          {state.error}
        </span>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-aurora px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-aurora/90 disabled:opacity-60"
      >
        {pending ? "Отправляем…" : "Отправить"}
      </button>
    </form>
  );
}
