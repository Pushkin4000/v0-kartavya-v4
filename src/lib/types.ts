
export type UserType = 'provider' | 'ngo';
export type FoodCategory = 'prepared' | 'grocery' | 'produce' | 'bakery' | 'dairy' | 'other';
export type FoodStatus = 'available' | 'claimed' | 'expired';
export type OrderStatus = 'placed' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  userType: UserType;
  registrationNumber?: string;
  peopleServed?: number;
  providerType?: string;
  createdAt: Date;
}

export interface FoodItem {
  id: number;
  name: string;
  providerId: number;
  providerName?: string;
  category: FoodCategory;
  quantity: number;
  quantityUnit: string;
  expiryDate: Date;
  description?: string;
  pickupInstructions?: string;
  status: FoodStatus;
  createdAt: Date;
}

export interface CartItem {
  id: number;
  ngoId: number;
  foodItemId: number;
  foodItem?: FoodItem;
  quantity: number;
  createdAt: Date;
}

export interface Order {
  id: number;
  ngoId: number;
  ngoName?: string;
  status: OrderStatus;
  contactPerson: string;
  contactPhone: string;
  pickupTime: Date;
  notes?: string;
  createdAt: Date;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  foodItemId: number;
  foodItem?: FoodItem;
  providerId: number;
  providerName?: string;
  quantity: number;
}
