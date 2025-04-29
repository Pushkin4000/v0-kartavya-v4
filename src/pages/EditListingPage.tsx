
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import FoodForm from '@/components/food/FoodForm';
import { foodService } from '@/lib/food-service';
import { FoodItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not logged in or not a provider
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.userType !== 'provider') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Load food item on component mount
  useEffect(() => {
    const fetchFoodItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const item = await foodService.getFoodItem(id);
        
        if (!item) {
          toast({
            title: 'Error',
            description: 'Food item not found.',
            variant: 'destructive',
          });
          navigate('/my-listings');
          return;
        }
        
        // Check if this item belongs to the current user
        if (item.providerId !== user.id) {
          toast({
            title: 'Access Denied',
            description: 'You do not have permission to edit this listing.',
            variant: 'destructive',
          });
          navigate('/my-listings');
          return;
        }
        
        setFoodItem(item);
      } catch (error) {
        console.error('Error fetching food item:', error);
        toast({
          title: 'Error',
          description: 'Failed to load food listing. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFoodItem();
  }, [id]);
  
  const handleSubmit = async (data: Omit<FoodItem, 'id' | 'createdAt' | 'status'>) => {
    if (!id || !foodItem) return;
    
    try {
      setIsSubmitting(true);
      
      await foodService.updateFoodItem(id, {
        ...data,
        id: id,
      });
      
      toast({
        title: 'Success',
        description: 'Food listing has been updated successfully.',
      });
      
      navigate('/my-listings');
    } catch (error) {
      console.error('Error updating food listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to update food listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Edit Food Listing</h1>
        <p className="text-gray-600">
          Update the details of your food donation.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : foodItem ? (
          <FoodForm
            initialData={foodItem}
            onSubmit={handleSubmit}
            isLoading={isSubmitting}
            providerId={user.id}
          />
        ) : null}
      </div>
    </PageLayout>
  );
}
