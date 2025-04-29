
import { CartItem, FoodItem } from './types';
import { mockCartItems, mockFoodItems } from './mock-data';

// In a real app, these would be API calls to your backend
export const cartService = {
  getCartItems: async (ngoId: number): Promise<CartItem[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Get cart items for the NGO
    const items = mockCartItems.filter(item => item.ngoId === ngoId);
    
    // Attach food item details to each cart item
    return items.map(item => ({
      ...item,
      foodItem: mockFoodItems.find(food => food.id === item.foodItemId)
    }));
  },
  
  addToCart: async (ngoId: number, foodItemId: number, quantity: number): Promise<CartItem> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if item is already in cart
    const existingItem = mockCartItems.find(
      item => item.ngoId === ngoId && item.foodItemId === foodItemId
    );
    
    if (existingItem) {
      // Update existing cart item quantity
      existingItem.quantity += quantity;
      return {
        ...existingItem,
        foodItem: mockFoodItems.find(food => food.id === existingItem.foodItemId)
      };
    } else {
      // Create new cart item
      const newItem: CartItem = {
        id: Math.max(...mockCartItems.map(i => i.id), 0) + 1,
        ngoId,
        foodItemId,
        quantity,
        createdAt: new Date(),
      };
      
      // Add food item details
      const foodItem = mockFoodItems.find(food => food.id === foodItemId);
      
      // Add to mock cart items
      mockCartItems.push(newItem);
      
      return {
        ...newItem,
        foodItem
      };
    }
  },
  
  updateCartItem: async (id: number, quantity: number): Promise<CartItem | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find cart item by id
    const index = mockCartItems.findIndex(item => item.id === id);
    if (index === -1) return null;
    
    // Update quantity
    mockCartItems[index].quantity = quantity;
    
    // Return updated cart item with food item details
    return {
      ...mockCartItems[index],
      foodItem: mockFoodItems.find(food => food.id === mockCartItems[index].foodItemId)
    };
  },
  
  removeFromCart: async (id: number): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find cart item by id
    const index = mockCartItems.findIndex(item => item.id === id);
    if (index === -1) return false;
    
    // Remove from mock cart items
    mockCartItems.splice(index, 1);
    
    return true;
  },
  
  clearCart: async (ngoId: number): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Remove all cart items for the NGO
    const cartItemsToKeep = mockCartItems.filter(item => item.ngoId !== ngoId);
    mockCartItems.length = 0;
    mockCartItems.push(...cartItemsToKeep);
    
    return true;
  }
};
