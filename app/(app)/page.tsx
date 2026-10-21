import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import {
  formatDateTime,
  formatShortDate,
  isOverdue,
} from "@/lib/format";
import { STATUS_LABELS } from "@/lib/constants";
import {
  ActivityPanel,
  DeadlinePanel,
  MyProjectsPanel,
  StatCard,
  type ActivityRow,
  type DeadlineRow,
  type MyProjectRow,
} from "@/components/home/widgets";

export const instant = false;

export default async function Home() {
  const user = await requireUser();
  const now = new Date();

  const visibleWhere =
    user.role === "admin" ? {} : { members: { some: { id: user.id } } };

  const day = now.getDay();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + (day === 0 ? 0 : 7 - day));
  weekEnd.setHours(23, 59, 59, 999);

  const [tasks, history, myProjects] = await Promise.all([
    prisma.task.findMany({
      where: { project: visibleWhere },
      select: {
        id: true,
        key: true,
        title: true,
        status: true,
        deadline: true,
      },
    }),
    prisma.statusHistory.findMany({
      where: { task: { project: visibleWhere } },
      orderBy: { changedAt: "desc" },
      take: 6,
      include: {
        changedBy: { select: { name: true } },
        task: { select: { id: true, key: true, title: true } },
      },
    }),
    prisma.project.findMany({
      where: {
        OR: [
          { leadId: user.id },
          { members: { some: { id: user.id } } },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, tasks: { select: { status: true } } },
    }),
  ]);

  const active = tasks.filter((task) => task.status !== "done");
  const overdue = active.filter((task) => isOverdue(task.deadline, task.status));
  const week = active.filter(
    (task) =>
      task.deadline && task.deadline >= now && task.deadline <= weekEnd,
  );

  const deadlineRows: DeadlineRow[] = active
    .filter((task) => task.deadline)
    .sort(
      (a, b) => (a.deadline?.getTime() ?? 0) - (b.deadline?.getTime() ?? 0),
    )
    .slice(0, 5)
    .map((task) => ({
      id: task.id,
      key: task.key,
      title: task.title,
      dateLabel: formatShortDate(task.deadline) ?? "",
      overdue: isOverdue(task.deadline, task.status),
    }));

  const activityRows: ActivityRow[] = history.map((row) => ({
    id: row.id,
    taskId: row.task.id,
    taskKey: row.task.key,
    taskTitle: row.task.title,
    who: row.changedBy.name,
    fromLabel: STATUS_LABELS[row.fromStatus] ?? row.fromStatus,
    toLabel: STATUS_LABELS[row.toStatus] ?? row.toStatus,
    whenLabel: formatDateTime(row.changedAt) ?? "",
  }));

  const projectRows: MyProjectRow[] = myProjects.map((project) => ({
    id: project.id,
    name: project.name,
    openTasks: project.tasks.filter((task) => task.status !== "done").length,
  }));

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
          Главная
        </h1>
        <p className="text-sm text-graphite/70 dark:text-white/60">
          Активность ваших проектов
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Активные задачи" value={active.length} />
        <StatCard title="Просроченные" value={overdue.length} danger />
        <StatCard title="На этой неделе" value={week.length} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DeadlinePanel rows={deadlineRows} />
        <ActivityPanel rows={activityRows} />
        <MyProjectsPanel rows={projectRows} />
      </section>
    </div>
  );
}
