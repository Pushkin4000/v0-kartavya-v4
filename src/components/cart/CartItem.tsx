
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem as CartItemType } from '@/lib/types';
import FoodCategoryBadge from '@/components/common/FoodCategoryBadge';
import ExpiryBadge from '@/components/common/ExpiryBadge';
import { useToast } from '@/hooks/use-toast';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const { toast } = useToast();
  
  if (!item.foodItem) {
    return null; // Don't render if food item is missing
  }

  const foodItem = item.foodItem;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= foodItem.quantity) {
      setQuantity(newQuantity);
    } else {
      toast({
        title: "Invalid quantity",
        description: `Quantity must be between 1 and ${foodItem.quantity}`,
        variant: "destructive"
      });
    }
  };

  const handleUpdateQuantity = async () => {
    if (quantity === item.quantity) return;
    
    try {
      setIsUpdating(true);
      await onUpdateQuantity(item.id, quantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive"
      });
      // Reset to original quantity on error
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBlur = () => {
    if (quantity !== item.quantity) {
      handleUpdateQuantity();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdateQuantity();
    }
  };

  const handleRemove = async () => {
    try {
      setIsRemoving(true);
      await onRemove(item.id);
    } catch (error) {
      console.error("Error removing item:", error);
      toast({
        title: "Error",
        description: "Failed to remove item. Please try again.",
        variant: "destructive"
      });
      setIsRemoving(false);
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b">
      <div className="flex-1">
        <h4 className="font-medium text-base">{foodItem.name}</h4>
        <div className="flex items-center space-x-2 mt-1">
          <p className="text-sm text-gray-500">
            {foodItem.providerName || 'Unknown Provider'}
          </p>
          <span className="text-gray-300">•</span>
          <FoodCategoryBadge category={foodItem.category} />
        </div>
        <div className="mt-1">
          <ExpiryBadge expiryDate={foodItem.expiryDate} />
        </div>
      </div>
      <div className="flex items-center w-24">
        <Input
          type="number"
          min="1"
          max={foodItem.quantity}
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-16 h-8 text-center"
          disabled={isUpdating}
        />
        <span className="ml-2 text-sm text-gray-500">{foodItem.quantityUnit}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleRemove}
        className="h-8 w-8 text-gray-500 hover:text-red-500"
        disabled={isRemoving}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
