// components/states/ErrorState.tsx — inline error message

interface ErrorStateProps {
  message: string;
}

export default function ErrorState({ message }: ErrorStateProps) {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
}
