
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FoodItem } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import FoodCategoryBadge from '@/components/common/FoodCategoryBadge';
import ExpiryBadge from '@/components/common/ExpiryBadge';

interface FoodCardProps {
  foodItem: FoodItem;
  onAddToCart?: (foodItem: FoodItem) => void;
}

export default function FoodCard({ foodItem, onAddToCart }: FoodCardProps) {
  const { user } = useAuth();
  const isNgo = user?.userType === 'ngo';
  const isProvider = user?.userType === 'provider';
  const isOwner = isProvider && user?.id === foodItem.providerId;

  // Generate placeholder images based on food category
  const getCategoryImage = (category: string) => {
    switch (category) {
      case 'prepared':
        return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&h=250&fit=crop';
      case 'bakery':
        return 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=400&h=250&fit=crop';
      case 'produce':
        return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=400&h=250&fit=crop';
      case 'grocery':
        return 'https://images.unsplash.com/photo-1579113800032-c38bd7635818?q=80&w=400&h=250&fit=crop';
      case 'dairy':
        return 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=80&w=400&h=250&fit=crop';
      default:
        return 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=400&h=250&fit=crop';
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(foodItem);
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={getCategoryImage(foodItem.category)}
          alt={foodItem.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 flex flex-col space-y-1">
          <FoodCategoryBadge category={foodItem.category} />
          <ExpiryBadge expiryDate={foodItem.expiryDate} />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg truncate">{foodItem.name}</h3>
          <p className="text-sm text-gray-500 truncate">
            {foodItem.providerName || 'Unknown Provider'}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <p className="font-medium">
              {foodItem.quantity} {foodItem.quantityUnit}
            </p>
          </div>
        </div>
        {foodItem.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {foodItem.description}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        {isNgo && (
          <Button 
            className="w-full" 
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        )}
        {isOwner && (
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link to={`/my-listings/${foodItem.id}/edit`}>
              Edit Listing
            </Link>
          </Button>
        )}
        {!isNgo && !isOwner && (
          <Button 
            variant="outline"
            className="w-full"
            asChild
          >
            <Link to={`/food/${foodItem.id}`}>View Details</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
