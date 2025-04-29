
import { FoodItem, FoodCategory, FoodStatus } from './types';
import { mockFoodItems } from './mock-data';

// In a real app, these would be API calls to your backend
export const foodService = {
  getAllFoodItems: async (): Promise<FoodItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return food items that are available
    return mockFoodItems.filter(item => item.status === 'available');
  },
  
  getFoodItemsByProvider: async (providerId: number): Promise<FoodItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter food items by provider
    return mockFoodItems.filter(item => item.providerId === providerId);
  },
  
  getFoodItem: async (id: number): Promise<FoodItem | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find food item by id
    const item = mockFoodItems.find(item => item.id === id);
    return item || null;
  },
  
  createFoodItem: async (item: Omit<FoodItem, 'id' | 'createdAt' | 'status'>): Promise<FoodItem> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would create a record in the database
    const newItem: FoodItem = {
      ...item,
      id: Math.max(...mockFoodItems.map(i => i.id)) + 1,
      status: 'available' as FoodStatus,
      createdAt: new Date(),
    };
    
    // In a real app, we would update the database here
    mockFoodItems.push(newItem);
    
    return newItem;
  },
  
  updateFoodItem: async (id: number, updates: Partial<FoodItem>): Promise<FoodItem | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find food item by id
    const index = mockFoodItems.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    // Update food item
    mockFoodItems[index] = { ...mockFoodItems[index], ...updates };
    
    return mockFoodItems[index];
  },
  
  deleteFoodItem: async (id: number): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, we would either delete or mark as deleted in the database
    // For our mock, we'll just filter it out
    const index = mockFoodItems.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    mockFoodItems.splice(index, 1);
    return true;
  }
};
