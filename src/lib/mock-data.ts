
import { FoodItem, CartItem, Order, OrderItem, User } from './types';

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    username: "food_bank_1",
    name: "City Food Bank",
    email: "contact@cityfoodbank.org",
    phone: "123-456-7890",
    address: "123 Main St, City",
    userType: "provider",
    providerType: "Food Bank",
    createdAt: new Date("2023-01-15")
  },
  {
    id: "2",
    username: "restaurant_1",
    name: "Green Plate Restaurant",
    email: "contact@greenplate.com",
    phone: "123-456-7891",
    address: "456 Oak St, City",
    userType: "provider",
    providerType: "Restaurant",
    createdAt: new Date("2023-01-20")
  },
  {
    id: "3",
    username: "helping_hands",
    name: "Helping Hands NGO",
    email: "contact@helpinghands.org",
    phone: "123-456-7892",
    address: "789 Pine St, City",
    userType: "ngo",
    registrationNumber: "NGO12345",
    peopleServed: 150,
    createdAt: new Date("2023-01-25")
  },
  {
    id: "4",
    username: "care_society",
    name: "Care Society",
    email: "contact@caresociety.org",
    phone: "123-456-7893",
    address: "101 Elm St, City",
    userType: "ngo",
    registrationNumber: "NGO67890",
    peopleServed: 200,
    createdAt: new Date("2023-02-01")
  }
];

// Mock food items data
export const mockFoodItems: FoodItem[] = [
  {
    id: "1",
    name: "Rice Bags",
    providerId: "1",
    providerName: "City Food Bank",
    category: "grocery",
    quantity: 50,
    quantityUnit: "kg",
    expiryDate: new Date("2023-12-31"),
    description: "White basmati rice bags",
    pickupInstructions: "Available for pickup from 9 AM to 5 PM weekdays",
    status: "available",
    createdAt: new Date("2023-03-15")
  },
  {
    id: "2",
    name: "Mixed Vegetables",
    providerId: "1",
    providerName: "City Food Bank",
    category: "produce",
    quantity: 20,
    quantityUnit: "kg",
    expiryDate: new Date("2023-10-15"),
    description: "Fresh seasonal vegetables",
    pickupInstructions: "Available for pickup from 9 AM to 5 PM weekdays",
    status: "available",
    createdAt: new Date("2023-03-16")
  },
  {
    id: "3",
    name: "Cooked Meals",
    providerId: "2",
    providerName: "Green Plate Restaurant",
    category: "prepared",
    quantity: 30,
    quantityUnit: "meals",
    expiryDate: new Date("2023-10-10"),
    description: "Vegetarian meals with rice and curry",
    pickupInstructions: "Available for pickup from 2 PM to 4 PM today",
    status: "available",
    createdAt: new Date("2023-03-17")
  },
  {
    id: "4",
    name: "Bread Loaves",
    providerId: "2",
    providerName: "Green Plate Restaurant",
    category: "bakery",
    quantity: 15,
    quantityUnit: "loaves",
    expiryDate: new Date("2023-10-12"),
    description: "Freshly baked whole wheat bread",
    pickupInstructions: "Available for pickup from 5 PM to 7 PM today",
    status: "available",
    createdAt: new Date("2023-03-18")
  }
];

// Mock cart items data
export const mockCartItems: CartItem[] = [
  {
    id: "1",
    ngoId: "3",
    foodItemId: "1",
    quantity: 10,
    createdAt: new Date("2023-04-01")
  },
  {
    id: "2",
    ngoId: "3",
    foodItemId: "2",
    quantity: 5,
    createdAt: new Date("2023-04-01")
  },
  {
    id: "3",
    ngoId: "4",
    foodItemId: "3",
    quantity: 15,
    createdAt: new Date("2023-04-02")
  }
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "1",
    ngoId: "3",
    ngoName: "Helping Hands NGO",
    status: "completed",
    contactPerson: "John Doe",
    contactPhone: "123-456-7892",
    pickupTime: new Date("2023-04-05T15:00:00"),
    notes: "Please pack items separately",
    createdAt: new Date("2023-04-03")
  },
  {
    id: "2",
    ngoId: "4",
    ngoName: "Care Society",
    status: "confirmed",
    contactPerson: "Jane Smith",
    contactPhone: "123-456-7893",
    pickupTime: new Date("2023-04-10T14:00:00"),
    createdAt: new Date("2023-04-04")
  }
];

// Mock order items data
export const mockOrderItems: OrderItem[] = [
  {
    id: "1",
    orderId: "1",
    foodItemId: "1",
    providerId: "1",
    providerName: "City Food Bank",
    quantity: 8
  },
  {
    id: "2",
    orderId: "1",
    foodItemId: "2",
    providerId: "1",
    providerName: "City Food Bank",
    quantity: 6
  },
  {
    id: "3",
    orderId: "2",
    foodItemId: "3",
    providerId: "2",
    providerName: "Green Plate Restaurant",
    quantity: 12
  }
];
