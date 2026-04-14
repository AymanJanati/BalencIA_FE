// components/ui/PageHeader.tsx — page title + subtitle + optional actions

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-page-title text-text-primary">{title}</h1>
        {subtitle && (
          <p className="text-secondary text-text-secondary">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0 pt-1">{actions}</div>
      )}
    </div>
  );
}
