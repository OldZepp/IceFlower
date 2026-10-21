import { Sidebar } from "../../components/layout/sidebar";
import { Hamburger } from "../../components/layout/hamburger";
import { Topbar } from "../../components/layout/topbar";
import { UserPanel } from "../../components/auth/user-panel";
import { Bell } from "../../components/notifications/bell";
import { requireUser } from "../../lib/access";
import { getMyNotifications } from "../../lib/notifications";

export const instant = false;

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const { items, unread } = await getMyNotifications(user.id);

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-col md:pl-[260px]">
        <Hamburger
          notifications={
            <Bell
              items={items}
              unread={unread}
              className="text-graphite hover:bg-black/5 dark:text-white dark:hover:bg-white/10"
            />
          }
        >
          <UserPanel />
        </Hamburger>
        <Topbar items={items} unread={unread} />
        <main className="flex-1 bg-snow pt-14 md:pt-0 dark:bg-graphite">
          {children}
        </main>
      </div>
    </div>
  );
}
