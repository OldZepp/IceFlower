import { redirect } from "next/navigation";
import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/profile/profile-form";
import { ThemeToggle } from "@/components/theme-toggle";

export const instant = false;

export default async function ProfilePage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, position: true, email: true, role: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 p-4 md:p-6">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-bold text-graphite md:text-3xl dark:text-white">
          Профиль
        </h1>
        <p className="text-sm text-graphite/70 dark:text-white/60">
          Личные данные и внешний вид
        </p>
      </header>

      <ProfileForm
        name={user.name}
        position={user.position ?? ""}
        email={user.email}
        role={user.role}
      />

      <section className="flex flex-col gap-3 rounded-lg border border-black/5 bg-white p-4 shadow-sm md:p-5 dark:border-white/10 dark:bg-graphite">
        <h2 className="font-heading text-base font-semibold text-graphite dark:text-white">
          Внешний вид
        </h2>
        <p className="text-sm text-graphite/60 dark:text-white/50">
          Переключатель применяется сразу и сохраняется в браузере.
        </p>
        <div className="rounded-md border border-graphite/10 dark:border-white/10">
          <ThemeToggle className="text-graphite hover:bg-black/5 focus-visible:ring-aurora/40 dark:text-white dark:hover:bg-white/10" />
        </div>
      </section>
    </div>
  );
}
