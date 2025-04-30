export type UserType = "provider" | "ngo"
export type FoodCategory = "prepared" | "grocery" | "produce" | "bakery" | "dairy" | "other"
export type FoodStatus = "available" | "claimed" | "expired"
export type OrderStatus = "placed" | "confirmed" | "ready" | "completed" | "cancelled"

export interface User {
  id: string // Changed from number to string for UUID compatibility
  username: string
  name: string
  email: string
  phone?: string
  address?: string
  userType: UserType
  registrationNumber?: string
  peopleServed?: number
  providerType?: string
  createdAt: Date
}

export interface FoodItem {
  id: string // Changed from number to string for UUID compatibility
  name: string
  providerId: string // Changed from number to string for UUID compatibility
  providerName?: string
  category: FoodCategory
  quantity: number
  quantityUnit: string
  expiryDate: Date
  description?: string
  pickupInstructions?: string
  status: FoodStatus
  createdAt: Date
}

export interface CartItem {
  id: string // Changed from number to string for UUID compatibility
  ngoId: string // Changed from number to string for UUID compatibility
  foodItemId: string // Changed from number to string for UUID compatibility
  foodItem?: FoodItem
  quantity: number
  createdAt: Date
}

export interface Order {
  id: string // Changed from number to string for UUID compatibility
  ngoId: string // Changed from number to string for UUID compatibility
  ngoName?: string
  status: OrderStatus
  contactPerson: string
  contactPhone: string
  pickupTime: Date
  notes?: string
  createdAt: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: string // Changed from number to string for UUID compatibility
  orderId: string // Changed from number to string for UUID compatibility
  foodItemId: string // Changed from number to string for UUID compatibility
  foodItem?: FoodItem
  providerId: string // Changed from number to string for UUID compatibility
  providerName?: string
  quantity: number
}
