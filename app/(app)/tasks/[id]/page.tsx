import Link from "next/link";
import type { ReactNode } from "react";
import { getAssignableUsers, getTaskForUser, requireUser } from "@/lib/access";
import { Avatar } from "@/components/avatar";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { StatusBadge } from "@/components/tasks/status-badge";
import { EditTaskButton } from "@/components/tasks/edit-task-button";
import { CommentForm } from "@/components/tasks/comment-form";
import {
  CommentItem,
  type CommentViewModel,
} from "@/components/tasks/comment-item";
import {
  StatusHistoryTimeline,
  type StatusHistoryItem,
} from "@/components/tasks/status-history";
import { STATUS_LABELS } from "@/lib/constants";
import {
  formatDate,
  formatDateTime,
  initialsOf,
  isOverdue,
  toDateInputValue,
} from "@/lib/format";

export const instant = false;

const labelClass =
  "text-[11px] uppercase tracking-wide text-graphite/50 dark:text-white/40";

function Detail({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <dt className={labelClass}>{label}</dt>
      <dd className="text-sm text-graphite dark:text-white">{children}</dd>
    </div>
  );
}

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const task = await getTaskForUser(id, user);
  const assignees = await getAssignableUsers(task.projectId);

  const canEdit =
    user.role === "admin" ||
    task.assigneeId === user.id ||
    task.creatorId === user.id;

  const overdue = isOverdue(task.deadline, task.status);
  const tags = task.tags;
  const links = task.links;

  const comments: CommentViewModel[] = task.comments.map((comment) => ({
    id: comment.id,
    text: comment.text,
    authorName: comment.author.name,
    authorInitials:
      comment.author.avatarInitials ?? initialsOf(comment.author.name),
    createdAtLabel: formatDateTime(comment.createdAt) ?? "",
    editedAtLabel: comment.editedAt ? formatDateTime(comment.editedAt) : null,
  }));

  const history: StatusHistoryItem[] = task.statusHistory.map((entry) => ({
    id: entry.id,
    fromLabel: STATUS_LABELS[entry.fromStatus] ?? entry.fromStatus,
    toLabel: STATUS_LABELS[entry.toStatus] ?? entry.toStatus,
    changedByName: entry.changedBy.name,
    changedAtLabel: formatDateTime(entry.changedAt) ?? "",
  }));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <Link
          href={`/projects/${task.project.id}?tab=board`}
          className="text-xs font-medium text-aurora hover:underline"
        >
          ← {task.project.name}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-xs font-semibold uppercase tracking-wide text-graphite/50 dark:text-white/40">
              {task.key}
            </span>
            <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
              {task.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusBadge value={task.status} />
              <PriorityBadge value={task.priority} />
              {overdue ? (
                <span className="inline-flex items-center rounded-full bg-danger/15 px-2 py-0.5 text-[11px] font-medium text-danger">
                  Просрочено
                </span>
              ) : null}
            </div>
          </div>

          {canEdit ? (
            <EditTaskButton
              task={{
                id: task.id,
                key: task.key,
                projectId: task.projectId,
                title: task.title,
                description: task.description ?? "",
                status: task.status,
                priority: task.priority,
                assigneeId: task.assigneeId ?? "",
                deadline: toDateInputValue(task.deadline),
                tags: tags.join(", "),
                links: links.join(" "),
              }}
              projectName={task.project.name}
              assignees={assignees}
            />
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-5">
          <section className="rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-graphite">
            <h2 className="font-heading text-sm font-semibold text-graphite dark:text-white">
              Описание
            </h2>
            <p className="mt-2 whitespace-pre-wrap text-sm text-graphite/80 dark:text-white/70">
              {task.description || "Описание не добавлено."}
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="font-heading text-sm font-semibold text-graphite dark:text-white">
              Комментарии ({comments.length})
            </h2>

            <CommentForm taskId={task.id} />

            {comments.length === 0 ? (
              <p className="rounded-lg border border-dashed border-black/10 bg-white p-4 text-sm text-graphite/60 dark:border-white/10 dark:bg-graphite dark:text-white/60">
                Комментариев пока нет.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    taskId={task.id}
                    canEdit={
                      user.role === "admin" ||
                      task.comments.find((c) => c.id === comment.id)?.authorId ===
                        user.id
                    }
                  />
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="flex flex-col gap-5">
          <dl className="flex flex-col gap-4 rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-graphite">
            <Detail label="Проект">
              <Link
                href={`/projects/${task.project.id}?tab=board`}
                className="text-aurora hover:underline"
              >
                {task.project.name}
              </Link>
            </Detail>

            <Detail label="Исполнитель">
              {task.assignee ? (
                <span className="flex items-center gap-2">
                  <Avatar
                    label={
                      task.assignee.avatarInitials ??
                      initialsOf(task.assignee.name)
                    }
                    size="xs"
                  />
                  {task.assignee.name}
                </span>
              ) : (
                "Не назначен"
              )}
            </Detail>

            <Detail label="Постановщик">
              <span className="flex items-center gap-2">
                <Avatar
                  label={
                    task.creator.avatarInitials ?? initialsOf(task.creator.name)
                  }
                  size="xs"
                />
                {task.creator.name}
              </span>
            </Detail>

            <Detail label="Создана">{formatDate(task.createdAt)}</Detail>
            <Detail label="Обновлена">{formatDate(task.updatedAt)}</Detail>

            <Detail label="Дедлайн">
              {task.deadline ? (
                <span className={overdue ? "font-medium text-danger" : ""}>
                  {formatDate(task.deadline)}
                  {overdue ? " · просрочено" : ""}
                </span>
              ) : (
                "Не задан"
              )}
            </Detail>

            {tags.length > 0 ? (
              <Detail label="Теги">
                <span className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-fjord/5 px-1.5 py-0.5 text-[10px] text-fjord/70 dark:bg-white/10 dark:text-white/60"
                    >
                      {tag}
                    </span>
                  ))}
                </span>
              </Detail>
            ) : null}

            {links.length > 0 ? (
              <Detail label="Ссылки">
                <span className="flex flex-col gap-1">
                  {links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-aurora hover:underline"
                    >
                      {link}
                    </a>
                  ))}
                </span>
              </Detail>
            ) : null}
          </dl>

          <section className="flex flex-col gap-3 rounded-lg border border-black/5 bg-white p-4 dark:border-white/10 dark:bg-graphite">
            <h2 className="font-heading text-sm font-semibold text-graphite dark:text-white">
              История статусов
            </h2>
            <StatusHistoryTimeline items={history} />
          </section>
        </aside>
      </div>
    </div>
  );
}
