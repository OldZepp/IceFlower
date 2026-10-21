import Link from "next/link";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { initialsOf } from "../../lib/format";
import { LogoutButton } from "./logout-button";

export async function UserPanel() {
  const session = await auth();
  const sessionUser = session?.user;
  if (!sessionUser?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, role: true, avatarInitials: true },
  });
  if (!user) return null;

  const label = user.avatarInitials ?? initialsOf(user.name);

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <Link
        href="/profile"
        aria-label="Профиль"
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md transition-colors hover:bg-white/10"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-aurora text-xs font-semibold text-white">
          {label}
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-medium text-white">
            {user.name}
          </span>
          <span className="truncate text-xs text-white/60">
            {user.role === "admin" ? "Администратор" : "Сотрудник"}
          </span>
        </span>
      </Link>
      <LogoutButton className="text-white/80" />
    </div>
  );
}
