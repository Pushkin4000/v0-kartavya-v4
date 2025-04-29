
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartItem as CartItemType } from '@/lib/types';
import FoodCategoryBadge from '@/components/common/FoodCategoryBadge';
import ExpiryBadge from '@/components/common/ExpiryBadge';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const foodItem = item.foodItem!;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= foodItem.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleUpdateQuantity = () => {
    onUpdateQuantity(item.id, quantity);
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
        />
        <span className="ml-2 text-sm text-gray-500">{foodItem.quantityUnit}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(item.id)}
        className="h-8 w-8 text-gray-500 hover:text-red-500"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
