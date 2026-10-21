import Link from "next/link";
import { redirect } from "next/navigation";
import { getSelectableUsers, requireUser } from "@/lib/access";
import { CreateProjectForm } from "@/components/projects/create-project-form";

export const instant = false;

export default async function NewProjectPage() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/projects");

  const users = await getSelectableUsers();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 p-4 md:p-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/projects"
          className="text-xs font-medium text-aurora hover:underline"
        >
          ← Все проекты
        </Link>
        <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
          Новый проект
        </h1>
        <p className="text-sm text-graphite/70 dark:text-white/60">
          Заполните поля и назначьте участников.
        </p>
      </div>

      <CreateProjectForm users={users} />
    </div>
  );
}
