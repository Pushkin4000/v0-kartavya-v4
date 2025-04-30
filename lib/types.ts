export type UserType = "provider" | "ngo"
export type FoodCategory = "prepared" | "grocery" | "produce" | "bakery" | "dairy" | "other"
export type OrderStatus = "placed" | "confirmed" | "ready" | "completed" | "cancelled"

export interface FoodItem {
  id: string
  name: string
  providerId: string
  providerName?: string
  category: FoodCategory
  quantity: number
  quantityUnit: string
  expiryDate: Date
  description?: string
  pickupInstructions?: string
  status: string
  createdAt: Date
}

export interface CartItem {
  id: string
  ngoId: string
  foodItemId: string
  foodItem?: FoodItem
  quantity: number
  createdAt: Date
}

export interface Order {
  id: string
  ngoId: string
  ngoName?: string
  status: OrderStatus
  contactPerson: string
  contactPhone: string
  pickupTime: Date
  notes?: string
  createdAt: Date
  items?: any[]
}
