
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionLink,
  onAction,
  icon
}: EmptyStateProps) {
  const handleAction = () => {
    if (onAction) {
      onAction();
    }
  };

  const ActionButton = () => {
    if (!actionLabel) return null;
    
    if (actionLink) {
      return (
        <Button asChild>
          <Link to={actionLink}>{actionLabel}</Link>
        </Button>
      );
    }
    
    return <Button onClick={handleAction}>{actionLabel}</Button>;
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="mb-6 text-kartavya-primary">{icon}</div>}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      <ActionButton />
    </div>
  );
}
