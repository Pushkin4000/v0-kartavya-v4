
import { FoodItem, FoodCategory, FoodStatus } from './types';
import { supabase } from '@/integrations/supabase/client';
import { mockFoodItems } from './mock-data';

// Helper function to convert Supabase food item to our app's FoodItem type
const mapFoodItemFromSupabase = (item: any): FoodItem => {
  return {
    id: item.id,
    name: item.name,
    providerId: item.provider_id,
    providerName: item.provider_name,
    category: item.category as FoodCategory,
    quantity: item.quantity,
    quantityUnit: item.quantity_unit,
    expiryDate: new Date(item.expiry_date),
    description: item.description || '',
    pickupInstructions: item.pickup_instructions || '',
    status: item.status as FoodStatus,
    createdAt: new Date(item.created_at)
  };
};

// Helper function to convert app FoodItem to Supabase format
const mapFoodItemToSupabase = (item: Partial<FoodItem>) => {
  const formattedExpiryDate = item.expiryDate instanceof Date 
    ? item.expiryDate.toISOString() 
    : item.expiryDate;

  return {
    name: item.name,
    provider_id: item.providerId,
    provider_name: item.providerName,
    category: item.category,
    quantity: item.quantity,
    quantity_unit: item.quantityUnit,
    expiry_date: formattedExpiryDate,
    description: item.description || null,
    pickup_instructions: item.pickupInstructions || null,
    status: item.status || 'available'
  };
};

export const foodService = {
  getAllFoodItems: async (): Promise<FoodItem[]> => {
    try {
      console.log("Fetching all available food items from Supabase...");
      
      // Remove the delay that might be causing timing issues
      // and fetch with a more direct approach
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching food items:', error);
        throw error;
      }

      console.log("Retrieved food items from Supabase:", data);
      return data ? data.map(mapFoodItemFromSupabase) : [];
    } catch (error) {
      console.error('Failed to fetch food items:', error);
      // Fallback to mock data in case of error
      console.log("Falling back to mock data");
      return mockFoodItems.filter(item => item.status === 'available');
    }
  },
  
  getFoodItemsByProvider: async (providerId: string): Promise<FoodItem[]> => {
    try {
      console.log(`Fetching food items for provider ${providerId}...`);
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('provider_id', providerId);

      if (error) {
        console.error('Error fetching provider food items:', error);
        throw error;
      }

      console.log("Retrieved provider food items:", data);
      return data ? data.map(mapFoodItemFromSupabase) : [];
    } catch (error) {
      console.error('Failed to fetch provider food items:', error);
      // Fallback to mock data in case of error
      return mockFoodItems.filter(item => item.providerId === providerId);
    }
  },
  
  getFoodItem: async (id: string): Promise<FoodItem | null> => {
    try {
      console.log(`Fetching food item with id ${id}...`);
      
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching food item:', error);
        throw error;
      }

      console.log("Retrieved food item:", data);
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
      const itemToInsert = mapFoodItemToSupabase(item);
      
      console.log("Creating food item in Supabase:", itemToInsert);
      
      const { data, error } = await supabase
        .from('food_items')
        .insert(itemToInsert)
        .select('*')
        .single();

      if (error) {
        console.error('Error creating food item:', error);
        throw error;
      }

      console.log("Created food item:", data);
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
      const updateData = mapFoodItemToSupabase(updates);
      
      console.log("Updating food item in Supabase:", id, updateData);

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

      console.log("Updated food item:", data);
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
      console.log(`Deleting food item with id ${id}...`);
      
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting food item:', error);
        throw error;
      }

      console.log("Food item deleted successfully");
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
