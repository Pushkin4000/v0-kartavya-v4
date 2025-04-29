
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { foodService } from '@/lib/food-service';
import { FoodItem } from '@/lib/types';
import FoodCategoryBadge from '@/components/common/FoodCategoryBadge';
import ExpiryBadge from '@/components/common/ExpiryBadge';
import EmptyState from '@/components/common/EmptyState';

export default function MyListingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Redirect if not logged in or not a provider
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.userType !== 'provider') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Load food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const items = await foodService.getFoodItemsByProvider(user.id);
        setFoodItems(items);
      } catch (error) {
        console.error('Error fetching food items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your food listings. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoodItems();
  }, []);
  
  const handleDeleteItem = async (id: string) => {
    try {
      const success = await foodService.deleteFoodItem(id);
      if (success) {
        setFoodItems(prevItems => prevItems.filter(item => item.id !== id));
        toast({
          title: 'Deleted',
          description: 'Food listing has been deleted successfully.',
        });
      }
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete food listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setItemToDelete(null);
    }
  };
  
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
  
  return (
    <PageLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">My Food Listings</h1>
          <p className="text-gray-600">
            Manage your food donations and update listings.
          </p>
        </div>
        <Button asChild>
          <Link to="/new-listing">
            <Plus className="mr-2 h-4 w-4" /> Add New Listing
          </Link>
        </Button>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 animate-pulse rounded-md h-72"
            />
          ))}
        </div>
      ) : foodItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {foodItems.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getCategoryImage(item.category)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  <FoodCategoryBadge category={item.category} />
                  <ExpiryBadge expiryDate={item.expiryDate} />
                </div>
                {item.status !== 'available' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-3 py-1 bg-gray-800 text-white rounded-md uppercase text-sm font-semibold">
                      {item.status}
                    </span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="mb-2">
                  <h3 className="font-semibold text-lg truncate">{item.name}</h3>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <p className="font-medium">
                      {item.quantity} {item.quantityUnit}
                    </p>
                  </div>
                </div>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <Link to={`/my-listings/${item.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                
                <AlertDialog open={itemToDelete === item.id} onOpenChange={(open) => !open && setItemToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => setItemToDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        food listing and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Food Listings Found"
          description="You haven't added any food items yet. Add your first listing to help those in need."
          icon={<Package className="h-16 w-16" />}
          actionLabel="Add Food Listing"
          actionLink="/new-listing"
        />
      )}
    </PageLayout>
  );
}
