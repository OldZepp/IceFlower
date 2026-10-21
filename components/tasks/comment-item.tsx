"use client";

import { useRef, useState } from "react";
import { useActionState } from "react";
import {
  deleteCommentAction,
  updateCommentAction,
  type CommentState,
} from "@/app/(app)/tasks/actions";
import { Avatar } from "@/components/avatar";

export type CommentViewModel = {
  id: string;
  text: string;
  authorInitials: string;
  authorName: string;
  createdAtLabel: string;
  editedAtLabel: string | null;
};

export function CommentItem({
  comment,
  taskId,
  canEdit,
}: {
  comment: CommentViewModel;
  taskId: string;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const deleteFormRef = useRef<HTMLFormElement>(null);

  const [editState, editAction, saving] = useActionState<CommentState, FormData>(
    updateCommentAction,
    null,
  );
  const [deleteState, deleteAction, deleting] = useActionState<
    CommentState,
    FormData
  >(deleteCommentAction, null);

  const [prevEditState, setPrevEditState] = useState(editState);
  if (editState !== prevEditState) {
    setPrevEditState(editState);
    if (editState?.ok) setEditing(false);
  }

  function handleDelete() {
    if (window.confirm("Удалить комментарий?")) {
      deleteFormRef.current?.requestSubmit();
    }
  }

  return (
    <li className="flex gap-3 rounded-lg border border-black/5 bg-white p-3 dark:border-white/10 dark:bg-graphite">
      <Avatar label={comment.authorInitials} size="sm" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-medium text-graphite dark:text-white">
            {comment.authorName}
          </span>
          <span className="text-xs text-graphite/50 dark:text-white/40">
            {comment.createdAtLabel}
          </span>
          {comment.editedAtLabel ? (
            <span className="text-xs text-graphite/50 dark:text-white/40">
              изменён {comment.editedAtLabel}
            </span>
          ) : null}
        </div>

        {editing ? (
          <form action={editAction} className="mt-2 flex flex-col gap-2">
            <input type="hidden" name="commentId" value={comment.id} />
            <input type="hidden" name="taskId" value={taskId} />
            <textarea
              name="text"
              required
              rows={3}
              maxLength={2000}
              defaultValue={comment.text}
              className="w-full resize-y rounded-md border border-graphite/20 bg-white px-3 py-2 text-sm text-graphite outline-none focus:border-aurora focus:ring-2 focus:ring-aurora/30 dark:border-white/20 dark:bg-graphite dark:text-white"
            />
            {editState?.error ? (
              <span role="alert" className="text-xs font-medium text-danger">
                {editState.error}
              </span>
            ) : null}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-aurora px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-aurora/90 disabled:opacity-60"
              >
                {saving ? "Сохраняем…" : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md px-3 py-1.5 text-xs font-medium text-graphite/70 transition-colors hover:text-graphite dark:text-white/70 dark:hover:text-white"
              >
                Отмена
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-1.5 whitespace-pre-wrap break-words text-sm text-graphite/90 dark:text-white/80">
            {comment.text}
          </p>
        )}

        {canEdit && !editing ? (
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-aurora transition-colors hover:underline"
            >
              Изменить
            </button>
            <form ref={deleteFormRef} action={deleteAction}>
              <input type="hidden" name="commentId" value={comment.id} />
              <input type="hidden" name="taskId" value={taskId} />
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs font-medium text-danger transition-colors hover:underline disabled:opacity-60"
              >
                {deleting ? "Удаляем…" : "Удалить"}
              </button>
            </form>
          </div>
        ) : null}

        {deleteState?.error ? (
          <span role="alert" className="mt-1 block text-xs font-medium text-danger">
            {deleteState.error}
          </span>
        ) : null}
      </div>
    </li>
  );
}
