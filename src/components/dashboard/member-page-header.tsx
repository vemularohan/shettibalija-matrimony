import type { ReactNode } from "react";

export function MemberPageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col justify-between gap-4 border-b border-[#ded5c8] pb-6 sm:flex-row sm:items-end">
      <div>
        <span className="sbm-kicker">{kicker}</span>
        <h1 className="sbm-heading mt-3">{title}</h1>
        {description ? <p className="sbm-body mt-3 max-w-2xl">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
