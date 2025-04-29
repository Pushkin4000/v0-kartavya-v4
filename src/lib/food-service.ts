
import { FoodItem, FoodCategory, FoodStatus } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth-context';
import { mockFoodItems } from './mock-data';

export const foodService = {
  getAllFoodItems: async (): Promise<FoodItem[]> => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching food items:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch food items:', error);
      // Fallback to mock data in case of error
      return mockFoodItems.filter(item => item.status === 'available');
    }
  },
  
  getFoodItemsByProvider: async (providerId: number): Promise<FoodItem[]> => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('provider_id', providerId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching provider food items:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to fetch provider food items:', error);
      // Fallback to mock data in case of error
      return mockFoodItems.filter(item => item.providerId === providerId);
    }
  },
  
  getFoodItem: async (id: number): Promise<FoodItem | null> => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching food item:', error);
        throw error;
      }

      return data || null;
    } catch (error) {
      console.error('Failed to fetch food item:', error);
      // Fallback to mock data in case of error
      const item = mockFoodItems.find(item => item.id === id);
      return item || null;
    }
  },
  
  createFoodItem: async (item: Omit<FoodItem, 'id' | 'createdAt' | 'status'>): Promise<FoodItem> => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert([{
          name: item.name,
          provider_id: item.providerId,
          provider_name: item.providerName,
          category: item.category,
          quantity: item.quantity,
          quantity_unit: item.quantityUnit,
          expiry_date: item.expiryDate,
          description: item.description,
          pickup_instructions: item.pickupInstructions,
          status: 'available'
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error creating food item:', error);
        throw error;
      }

      return data as unknown as FoodItem;
    } catch (error) {
      console.error('Failed to create food item:', error);
      // Fallback to mock implementation in case of error
      const newItem: FoodItem = {
        ...item,
        id: Math.max(...mockFoodItems.map(i => i.id)) + 1,
        status: 'available' as FoodStatus,
        createdAt: new Date(),
      };
      
      mockFoodItems.push(newItem);
      return newItem;
    }
  },
  
  updateFoodItem: async (id: number, updates: Partial<FoodItem>): Promise<FoodItem | null> => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .update({
          name: updates.name,
          category: updates.category,
          quantity: updates.quantity,
          quantity_unit: updates.quantityUnit,
          expiry_date: updates.expiryDate,
          description: updates.description,
          pickup_instructions: updates.pickupInstructions,
          status: updates.status
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating food item:', error);
        throw error;
      }

      return data as unknown as FoodItem;
    } catch (error) {
      console.error('Failed to update food item:', error);
      // Fallback to mock implementation in case of error
      const index = mockFoodItems.findIndex(item => item.id === id);
      if (index === -1) return null;
      
      mockFoodItems[index] = { ...mockFoodItems[index], ...updates };
      return mockFoodItems[index];
    }
  },
  
  deleteFoodItem: async (id: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting food item:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to delete food item:', error);
      // Fallback to mock implementation in case of error
      const index = mockFoodItems.findIndex(item => item.id === id);
      if (index === -1) return false;
      
      mockFoodItems.splice(index, 1);
      return true;
    }
  }
};
