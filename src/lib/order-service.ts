
import { Order, OrderItem, OrderStatus } from './types';
import { mockOrders, mockOrderItems, mockFoodItems } from './mock-data';
import { cartService } from './cart-service';

// In a real app, these would be API calls to your backend
export const orderService = {
  getOrders: async (userId: number, userType: 'provider' | 'ngo'): Promise<Order[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let filteredOrders: Order[];
    
    if (userType === 'ngo') {
      // For NGOs, get orders they've placed
      filteredOrders = mockOrders.filter(order => order.ngoId === userId);
    } else {
      // For providers, get orders for their food items
      // We need to find orders that contain food items from this provider
      const providerOrderIds = new Set(
        mockOrderItems
          .filter(item => item.providerId === userId)
          .map(item => item.orderId)
      );
      
      filteredOrders = mockOrders.filter(order => providerOrderIds.has(order.id));
    }
    
    // Attach order items to each order
    return filteredOrders.map(order => ({
      ...order,
      items: mockOrderItems.filter(item => item.orderId === order.id).map(item => ({
        ...item,
        foodItem: mockFoodItems.find(food => food.id === item.foodItemId)
      }))
    }));
  },
  
  getOrder: async (id: number): Promise<Order | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find order by id
    const order = mockOrders.find(order => order.id === id);
    if (!order) return null;
    
    // Attach order items
    return {
      ...order,
      items: mockOrderItems.filter(item => item.orderId === id).map(item => ({
        ...item,
        foodItem: mockFoodItems.find(food => food.id === item.foodItemId)
      }))
    };
  },
  
  createOrder: async (
    ngoId: number,
    ngoName: string,
    contactPerson: string,
    contactPhone: string,
    pickupTime: Date,
    notes?: string
  ): Promise<Order> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get cart items for the NGO
    const cartItems = await cartService.getCartItems(ngoId);
    
    // Create new order
    const newOrder: Order = {
      id: Math.max(...mockOrders.map(o => o.id), 0) + 1,
      ngoId,
      ngoName,
      status: 'placed',
      contactPerson,
      contactPhone,
      pickupTime,
      notes,
      createdAt: new Date(),
      items: []
    };
    
    // Create order items from cart items
    const orderItems: OrderItem[] = cartItems.map((cartItem, index) => {
      const foodItem = mockFoodItems.find(food => food.id === cartItem.foodItemId)!;
      
      return {
        id: Math.max(...mockOrderItems.map(i => i.id), 0) + index + 1,
        orderId: newOrder.id,
        foodItemId: cartItem.foodItemId,
        foodItem,
        providerId: foodItem.providerId,
        providerName: foodItem.providerName,
        quantity: cartItem.quantity
      };
    });
    
    // Add order items to the order
    newOrder.items = orderItems;
    
    // Add to mock orders and order items
    mockOrders.push(newOrder);
    mockOrderItems.push(...orderItems);
    
    // Clear the cart
    await cartService.clearCart(ngoId);
    
    return newOrder;
  },
  
  updateOrderStatus: async (id: number, status: OrderStatus): Promise<Order | null> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find order by id
    const index = mockOrders.findIndex(order => order.id === id);
    if (index === -1) return null;
    
    // Update status
    mockOrders[index].status = status;
    
    // Return updated order with items
    return {
      ...mockOrders[index],
      items: mockOrderItems.filter(item => item.orderId === id).map(item => ({
        ...item,
        foodItem: mockFoodItems.find(food => food.id === item.foodItemId)
      }))
    };
  }
};
