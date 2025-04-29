
import { User, FoodItem, CartItem, Order, OrderItem } from './types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'arjun_restaurant',
    name: 'Arjun Restaurant',
    email: 'arjun@example.com',
    phone: '9876543210',
    address: '123 Food St, Mumbai',
    userType: 'provider',
    providerType: 'Restaurant',
    createdAt: new Date('2023-01-15'),
  },
  {
    id: 2,
    username: 'krishna_bakery',
    name: 'Krishna Bakery',
    email: 'krishna@example.com',
    phone: '8765432109',
    address: '456 Bread Ave, Delhi',
    userType: 'provider',
    providerType: 'Bakery',
    createdAt: new Date('2023-02-10'),
  },
  {
    id: 3,
    username: 'seva_foundation',
    name: 'Seva Foundation',
    email: 'seva@example.com',
    phone: '7654321098',
    address: '789 Help Rd, Bangalore',
    userType: 'ngo',
    registrationNumber: 'NGO123456',
    peopleServed: 250,
    createdAt: new Date('2023-01-05'),
  },
  {
    id: 4,
    username: 'humane_society',
    name: 'Humane Society',
    email: 'humane@example.com',
    phone: '6543210987',
    address: '321 Care Ln, Chennai',
    userType: 'ngo',
    registrationNumber: 'NGO789012',
    peopleServed: 175,
    createdAt: new Date('2023-03-01'),
  },
];

// Mock Food Items
export const mockFoodItems: FoodItem[] = [
  {
    id: 1,
    name: 'Vegetable Biryani',
    providerId: 1,
    providerName: 'Arjun Restaurant',
    category: 'prepared',
    quantity: 10,
    quantityUnit: 'servings',
    expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    description: 'Freshly made vegetable biryani, can serve 10 people',
    pickupInstructions: 'Available for pickup after 8 PM',
    status: 'available',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: 'Fresh Bread Loaves',
    providerId: 2,
    providerName: 'Krishna Bakery',
    category: 'bakery',
    quantity: 20,
    quantityUnit: 'loaves',
    expiryDate: new Date(Date.now() + 36 * 60 * 60 * 1000), // 36 hours from now
    description: 'Whole wheat bread loaves, baked this morning',
    pickupInstructions: 'Pickup from back entrance between 7-9 PM',
    status: 'available',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 3,
    name: 'Mixed Vegetables',
    providerId: 1,
    providerName: 'Arjun Restaurant',
    category: 'produce',
    quantity: 15,
    quantityUnit: 'kg',
    expiryDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
    description: 'Assorted vegetables including carrots, potatoes, and tomatoes',
    pickupInstructions: 'Call 30 minutes before pickup',
    status: 'available',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: 'Pastries and Cakes',
    providerId: 2,
    providerName: 'Krishna Bakery',
    category: 'bakery',
    quantity: 30,
    quantityUnit: 'pieces',
    expiryDate: new Date(Date.now() + 18 * 60 * 60 * 1000), // 18 hours from now
    description: 'Assortment of pastries and cake slices',
    pickupInstructions: 'Available from front counter until closing',
    status: 'available',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 5,
    name: 'Rice Packets',
    providerId: 1,
    providerName: 'Arjun Restaurant',
    category: 'grocery',
    quantity: 25,
    quantityUnit: 'kg',
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    description: 'Basmati rice packets, 1kg each',
    pickupInstructions: 'Contact manager for pickup details',
    status: 'available',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
];

// Mock Cart Items
export const mockCartItems: CartItem[] = [
  {
    id: 1,
    ngoId: 3,
    foodItemId: 1,
    foodItem: mockFoodItems.find(item => item.id === 1),
    quantity: 5,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 2,
    ngoId: 3,
    foodItemId: 2,
    foodItem: mockFoodItems.find(item => item.id === 2),
    quantity: 10,
    createdAt: new Date(Date.now() - 45 * 60 * 1000),
  },
];

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: 1,
    ngoId: 3,
    ngoName: 'Seva Foundation',
    status: 'confirmed',
    contactPerson: 'Ramesh Kumar',
    contactPhone: '7654321098',
    pickupTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
    notes: 'Will send van for pickup',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    items: [
      {
        id: 1,
        orderId: 1,
        foodItemId: 3,
        foodItem: mockFoodItems.find(item => item.id === 3),
        providerId: 1,
        providerName: 'Arjun Restaurant',
        quantity: 8,
      },
      {
        id: 2,
        orderId: 1,
        foodItemId: 4,
        foodItem: mockFoodItems.find(item => item.id === 4),
        providerId: 2,
        providerName: 'Krishna Bakery',
        quantity: 15,
      },
    ],
  },
  {
    id: 2,
    ngoId: 4,
    ngoName: 'Humane Society',
    status: 'placed',
    contactPerson: 'Sita Sharma',
    contactPhone: '6543210987',
    pickupTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    items: [
      {
        id: 3,
        orderId: 2,
        foodItemId: 1,
        foodItem: mockFoodItems.find(item => item.id === 1),
        providerId: 1,
        providerName: 'Arjun Restaurant',
        quantity: 5,
      },
    ],
  },
];

// Mock Order Items
export const mockOrderItems: OrderItem[] = [
  ...mockOrders.flatMap(order => order.items || []),
];
