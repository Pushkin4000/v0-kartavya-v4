
import { FoodItem, FoodCategory, FoodStatus } from './types';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './auth-context';
import { mockFoodItems } from './mock-data';

// Helper function to convert Supabase food item to our app's FoodItem type
const mapFoodItemFromSupabase = (item: any): FoodItem => {
  return {
    id: item.id,
    name: item.name,
    providerId: item.provider_id,
    providerName: item.provider_name,
    category: item.category,
    quantity: item.quantity,
    quantityUnit: item.quantity_unit,
    expiryDate: new Date(item.expiry_date),
    description: item.description,
    pickupInstructions: item.pickup_instructions,
    status: item.status,
    createdAt: new Date(item.created_at)
  };
};

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

      return data ? data.map(mapFoodItemFromSupabase) : [];
    } catch (error) {
      console.error('Failed to fetch food items:', error);
      // Fallback to mock data in case of error
      return mockFoodItems.filter(item => item.status === 'available');
    }
  },
  
  getFoodItemsByProvider: async (providerId: string): Promise<FoodItem[]> => {
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

      return data ? data.map(mapFoodItemFromSupabase) : [];
    } catch (error) {
      console.error('Failed to fetch provider food items:', error);
      // Fallback to mock data in case of error
      return mockFoodItems.filter(item => item.providerId === providerId);
    }
  },
  
  getFoodItem: async (id: string): Promise<FoodItem | null> => {
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

      return data ? mapFoodItemFromSupabase(data) : null;
    } catch (error) {
      console.error('Failed to fetch food item:', error);
      // Fallback to mock data in case of error
      const item = mockFoodItems.find(item => item.id === id);
      return item || null;
    }
  },
  
  createFoodItem: async (item: Omit<FoodItem, 'id' | 'createdAt' | 'status'>): Promise<FoodItem> => {
    try {
      const formattedExpiryDate = item.expiryDate instanceof Date 
        ? item.expiryDate.toISOString() 
        : item.expiryDate;

      const { data, error } = await supabase
        .from('food_items')
        .insert({
          name: item.name,
          provider_id: item.providerId,
          provider_name: item.providerName,
          category: item.category,
          quantity: item.quantity,
          quantity_unit: item.quantityUnit,
          expiry_date: formattedExpiryDate,
          description: item.description,
          pickup_instructions: item.pickupInstructions,
          status: 'available'
        })
        .select('*')
        .single();

      if (error) {
        console.error('Error creating food item:', error);
        throw error;
      }

      return mapFoodItemFromSupabase(data);
    } catch (error) {
      console.error('Failed to create food item:', error);
      // Fallback to mock implementation in case of error
      const newItem: FoodItem = {
        ...item,
        id: `mock-${Date.now()}`,
        status: 'available' as FoodStatus,
        createdAt: new Date(),
      };
      
      mockFoodItems.push(newItem);
      return newItem;
    }
  },
  
  updateFoodItem: async (id: string, updates: Partial<FoodItem>): Promise<FoodItem | null> => {
    try {
      // Convert Date objects to ISO strings for Supabase
      const formattedExpiryDate = updates.expiryDate instanceof Date
        ? updates.expiryDate.toISOString()
        : updates.expiryDate;

      const updateData: any = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.category) updateData.category = updates.category;
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.quantityUnit) updateData.quantity_unit = updates.quantityUnit;
      if (formattedExpiryDate) updateData.expiry_date = formattedExpiryDate;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.pickupInstructions !== undefined) updateData.pickup_instructions = updates.pickupInstructions;
      if (updates.status) updateData.status = updates.status;

      const { data, error } = await supabase
        .from('food_items')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating food item:', error);
        throw error;
      }

      return mapFoodItemFromSupabase(data);
    } catch (error) {
      console.error('Failed to update food item:', error);
      // Fallback to mock implementation in case of error
      const index = mockFoodItems.findIndex(item => item.id === id);
      if (index === -1) return null;
      
      mockFoodItems[index] = { ...mockFoodItems[index], ...updates };
      return mockFoodItems[index];
    }
  },
  
  deleteFoodItem: async (id: string): Promise<boolean> => {
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
