
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Order, UserType, OrderStatus } from '@/lib/types';
import OrderStatusBadge from '@/components/common/OrderStatusBadge';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
  userType: UserType;
  onUpdateStatus?: (orderId: string, status: OrderStatus) => void;
}

export default function OrderCard({ order, userType, onUpdateStatus }: OrderCardProps) {
  const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const uniqueItems = order.items?.length || 0;
  
  // Format dates for display
  const formatDate = (date: Date) => format(date, 'MMM d, yyyy');
  const formatTime = (date: Date) => format(date, 'h:mm a');
  
  // Helper function to get next status
  const getNextStatus = () => {
    switch (order.status) {
      case 'placed':
        return 'confirmed';
      case 'confirmed':
        return 'ready';
      case 'ready':
        return 'completed';
      default:
        return null;
    }
  };
  
  const nextStatus = getNextStatus();
  const canChangeStatus = userType === 'provider' && nextStatus;
  
  const getNextStatusLabel = () => {
    switch (nextStatus) {
      case 'confirmed':
        return 'Confirm Order';
      case 'ready':
        return 'Mark as Ready';
      case 'completed':
        return 'Mark as Completed';
      default:
        return '';
    }
  };
  
  const handleStatusChange = () => {
    if (nextStatus && onUpdateStatus) {
      onUpdateStatus(order.id, nextStatus);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
            <p className="text-sm text-gray-500">
              {userType === 'provider' ? order.ngoName : 'Your order'}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{formatDate(order.pickupTime)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-sm">{formatTime(order.pickupTime)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span>{uniqueItems} types of items</span>
          <span>{totalItems} total items</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button 
          variant="outline" 
          className="w-full mr-2"
          asChild
        >
          <Link to={`/orders/${order.id}`}>View Details</Link>
        </Button>
        
        {canChangeStatus && (
          <Button 
            onClick={handleStatusChange}
            className="w-full ml-2"
          >
            {getNextStatusLabel()}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
