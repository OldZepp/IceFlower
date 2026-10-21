import { Avatar } from "@/components/avatar";

export type MemberItem = {
  id: string;
  name: string;
  position: string | null;
  email: string;
  initials: string;
};

export function MembersList({
  members,
  leadId,
}: {
  members: MemberItem[];
  leadId: string;
}) {
  return (
    <ul className="divide-y divide-black/5 overflow-hidden rounded-lg border border-black/5 bg-white dark:divide-white/5 dark:border-white/10 dark:bg-graphite">
      {members.map((member) => (
        <li key={member.id} className="flex items-center gap-3 px-4 py-3">
          <Avatar label={member.initials} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-medium text-graphite dark:text-white">
              <span className="truncate">{member.name}</span>
              {member.id === leadId ? (
                <span className="rounded-full bg-aurora/15 px-2 py-0.5 text-[10px] font-medium text-aurora">
                  Руководитель
                </span>
              ) : null}
            </p>
            <p className="truncate text-xs text-graphite/60 dark:text-white/50">
              {member.position ?? "Должность не указана"}
            </p>
          </div>
          <span className="hidden shrink-0 text-xs text-graphite/60 sm:block dark:text-white/50">
            {member.email}
          </span>
        </li>
      ))}
    </ul>
  );
}
