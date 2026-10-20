import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  text: string;
  action?: ReactNode;
}

export function EmptyState({ title, text, action }: EmptyStateProps) {
  return (
    <div className="state">
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{text}</p>
      {action}
    </div>
  );
}
