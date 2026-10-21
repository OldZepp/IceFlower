import { Suspense } from "react";
import Link from "next/link";
import { requireUser } from "@/lib/access";
import {
  getFilterProjects,
  getMyTasks,
  hasActiveFilters,
  myTasksHref,
  parseMyTasksQuery,
} from "@/lib/my-tasks";
import { MyTasksFilters } from "@/components/tasks/my-tasks-filters";
import { ViewSwitch } from "@/components/tasks/view-switch";
import { KanbanBoard } from "@/components/projects/board/kanban-board";
import { TaskList, type TaskListRow } from "@/components/projects/task-list";

export const instant = false;

export default async function MyTasksPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseMyTasksQuery(params);

  const user = await requireUser();
  const [tasks, projects] = await Promise.all([
    getMyTasks(user.id, query),
    getFilterProjects(user),
  ]);

  const listRows: TaskListRow[] = tasks.map((task) => ({
    id: task.id,
    key: task.key,
    title: task.title,
    status: task.status,
    priority: task.priority,
    assigneeInitials: task.assigneeInitials,
    creatorInitials: task.creatorInitials,
    deadlineLabel: task.deadlineLabel,
    overdue: task.overdue,
    tags: task.tags,
    project: { id: task.projectId, name: task.projectName },
  }));

  const filtersActive = hasActiveFilters(query);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
            Мои задачи
          </h1>
          <p className="mt-1 text-sm text-graphite/70 dark:text-white/60">
            Задачи, где вы исполнитель · {tasks.length}
          </p>
        </div>

        <ViewSwitch
          value={query.view}
          listHref={myTasksHref(query, { view: "list" })}
          boardHref={myTasksHref(query, { view: "board" })}
        />
      </header>

      <Suspense
        fallback={
          <div className="h-40 rounded-lg border border-black/5 bg-white dark:border-white/10 dark:bg-graphite" />
        }
      >
        <MyTasksFilters projects={projects} count={tasks.length} />
      </Suspense>

      {tasks.length === 0 ? (
        <p className="rounded-lg border border-dashed border-black/10 bg-white p-6 text-center text-sm text-graphite/60 dark:border-white/10 dark:bg-graphite dark:text-white/60">
          {filtersActive ? (
            <>
              Ничего не найдено по текущим фильтрам.{" "}
              <Link href="/tasks/my" className="font-medium text-aurora hover:underline">
                Сбросить фильтры
              </Link>
            </>
          ) : (
            "У вас пока нет задач. Они появятся здесь, когда вас назначат исполнителем."
          )}
        </p>
      ) : query.view === "board" ? (
        <KanbanBoard tasks={tasks} currentUserId={user.id} role={user.role} />
      ) : (
        <TaskList rows={listRows} showProject hideAssignee />
      )}
    </div>
  );
}
