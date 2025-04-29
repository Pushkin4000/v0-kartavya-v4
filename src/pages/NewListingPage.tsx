
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import FoodForm from '@/components/food/FoodForm';
import { foodService } from '@/lib/food-service';
import { FoodItem } from '@/lib/types';

export default function NewListingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect if not logged in or not a provider
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.userType !== 'provider') {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSubmit = async (data: Omit<FoodItem, 'id' | 'createdAt' | 'status'>) => {
    try {
      setIsSubmitting(true);
      
      // Add provider name to the data
      const dataWithProviderName = {
        ...data,
        providerName: user.name,
      };
      
      await foodService.createFoodItem(dataWithProviderName);
      
      toast({
        title: 'Success',
        description: 'Food listing has been added successfully.',
      });
      
      navigate('/my-listings');
    } catch (error) {
      console.error('Error adding food listing:', error);
      toast({
        title: 'Error',
        description: 'Failed to add food listing. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Add New Food Listing</h1>
        <p className="text-gray-600">
          Share details about the food you're donating to help NGOs find what they need.
        </p>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <FoodForm
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          providerId={user.id}
        />
      </div>
    </PageLayout>
  );
}
