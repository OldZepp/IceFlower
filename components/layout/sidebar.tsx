import { Logo } from "../logo";
import { ThemeToggle } from "../theme-toggle";
import { UserPanel } from "../auth/user-panel";
import { NavLinks } from "./nav-links";

export function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] flex-col bg-fjord text-white">
      <div className="flex h-14 items-center px-4 border-b border-white/10">
        <Logo variant="dark" height={28} />
      </div>
      <NavLinks />
      <div className="border-t border-white/10 py-2">
        <UserPanel />
        <ThemeToggle className="mx-3 justify-start text-white/90 hover:bg-white/10 hover:text-white focus-visible:ring-white/40" />
      </div>
    </aside>
  );
}
