// components/states/EmptyState.tsx — no data message + optional CTA

interface EmptyStateProps {
  message: string;
  action?: React.ReactNode;
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div>
      <p>{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
