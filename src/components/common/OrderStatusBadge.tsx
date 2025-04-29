
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/lib/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

export default function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return { label: 'Placed', color: 'bg-blue-100 text-blue-800 hover:bg-blue-200' };
      case 'confirmed':
        return { label: 'Confirmed', color: 'bg-purple-100 text-purple-800 hover:bg-purple-200' };
      case 'ready':
        return { label: 'Ready for Pickup', color: 'bg-amber-100 text-amber-800 hover:bg-amber-200' };
      case 'completed':
        return { label: 'Completed', color: 'bg-green-100 text-green-800 hover:bg-green-200' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-100 text-red-800 hover:bg-red-200' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' };
    }
  };

  const { label, color } = getStatusDetails(status);

  return (
    <Badge className={`font-medium ${color} ${className}`} variant="outline">
      {label}
    </Badge>
  );
}
