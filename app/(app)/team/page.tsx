import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { initialsOf, isOverdue } from "@/lib/format";
import { TeamList, type TeamRow } from "@/components/team/team-list";

export const instant = false;

export default async function TeamPage() {
  await requireUser();

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      position: true,
      avatarInitials: true,
      assignedTasks: { select: { status: true, deadline: true } },
    },
  });

  const rows: TeamRow[] = users.map((user) => {
    const active = user.assignedTasks.filter((task) => task.status !== "done");
    const overdue = active.filter((task) =>
      isOverdue(task.deadline, task.status),
    );
    return {
      id: user.id,
      name: user.name,
      position: user.position ?? "Сотрудник",
      email: user.email,
      initials: user.avatarInitials ?? initialsOf(user.name),
      active: active.length,
      overdue: overdue.length,
    };
  });

  const maxActive = Math.max(1, ...rows.map((row) => row.active));

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
          Команда
        </h1>
        <p className="text-sm text-graphite/70 dark:text-white/60">
          Сотрудники и текущая загрузка · {rows.length}
        </p>
      </header>

      <TeamList rows={rows} maxActive={maxActive} />
    </div>
  );
}
