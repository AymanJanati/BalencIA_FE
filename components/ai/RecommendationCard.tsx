// components/ai/RecommendationCard.tsx — employee-facing action list

interface RecommendationCardProps {
  actions: string[];
}

export default function RecommendationCard({ actions }: RecommendationCardProps) {
  return (
    <div>
      {/* TODO: Action list for employee recommendations */}
      <ul>
        {actions.map((action, i) => (
          <li key={i}>{action}</li>
        ))}
      </ul>
    </div>
  );
}
