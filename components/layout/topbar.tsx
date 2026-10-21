import { Bell } from "../notifications/bell";
import { GlobalSearch } from "../search/global-search";
import type { NotificationItem } from "@/lib/notifications";

export function Topbar({
  items,
  unread,
}: {
  items: NotificationItem[];
  unread: number;
}) {
  return (
    <header className="sticky top-0 z-30 hidden h-14 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-fjord px-4 md:flex">
      <GlobalSearch className="w-full max-w-md" />
      <Bell items={items} unread={unread} className="text-white hover:bg-white/10 focus-visible:ring-white/40" />
    </header>
  );
}
