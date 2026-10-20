interface LoadingStateProps {
  label: string;
}

export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="state" role="status">
      <div className="spinner" aria-hidden="true" />
      <p className="state__text">{label}</p>
    </div>
  );
}
