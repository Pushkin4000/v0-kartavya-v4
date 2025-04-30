import type { CartItem } from "./types"
import { supabase } from "@/integrations/supabase/client"
import { mockCartItems, mockFoodItems } from "./mock-data"

// Helper function to map Supabase data to our app's CartItem type
const mapCartItemFromSupabase = (cartItem: any, foodItem?: any): CartItem => {
  return {
    id: cartItem.id,
    ngoId: cartItem.ngo_id,
    foodItemId: cartItem.food_item_id,
    quantity: cartItem.quantity,
    createdAt: new Date(cartItem.created_at),
    foodItem: foodItem
      ? {
          id: foodItem.id,
          name: foodItem.name,
          providerId: foodItem.provider_id,
          providerName: foodItem.provider_name,
          category: foodItem.category,
          quantity: foodItem.quantity,
          quantityUnit: foodItem.quantity_unit,
          expiryDate: new Date(foodItem.expiry_date),
          description: foodItem.description,
          pickupInstructions: foodItem.pickup_instructions,
          status: foodItem.status,
          createdAt: new Date(foodItem.created_at),
        }
      : undefined,
  }
}

export const cartService = {
  getCartItems: async (ngoId: string): Promise<CartItem[]> => {
    try {
      // Get cart items for the NGO
      const { data: cartData, error: cartError } = await supabase.from("cart_items").select("*").eq("ngo_id", ngoId)

      if (cartError) {
        console.error("Error fetching cart items:", cartError)
        throw cartError
      }

      if (!cartData || cartData.length === 0) {
        return []
      }

      // Get food items for cart items
      const foodItemIds = cartData.map((item) => item.food_item_id)
      const { data: foodData, error: foodError } = await supabase.from("food_items").select("*").in("id", foodItemIds)

      if (foodError) {
        console.error("Error fetching food items for cart:", foodError)
        throw foodError
      }

      // Combine cart items with food item details
      return cartData.map((cartItem) => {
        const foodItem = foodData?.find((food) => food.id === cartItem.food_item_id)
        return mapCartItemFromSupabase(cartItem, foodItem)
      })
    } catch (error) {
      console.error("Failed to fetch cart items:", error)
      // Fallback to mock data
      const items = mockCartItems.filter((item) => item.ngoId === ngoId)
      return items.map((item) => ({
        ...item,
        foodItem: mockFoodItems.find((food) => food.id === item.foodItemId),
      }))
    }
  },

  addToCart: async (ngoId: string, foodItemId: string, quantity: number): Promise<CartItem> => {
    try {
      // Check if item is already in cart
      const { data: existingItems, error: checkError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("ngo_id", ngoId)
        .eq("food_item_id", foodItemId)

      if (checkError) {
        console.error("Error checking cart items:", checkError)
        throw checkError
      }

      let result
      if (existingItems && existingItems.length > 0) {
        // Update existing cart item quantity
        const existingItem = existingItems[0]
        const newQuantity = existingItem.quantity + quantity

        const { data, error } = await supabase
          .from("cart_items")
          .update({ quantity: newQuantity })
          .eq("id", existingItem.id)
          .select("*")
          .single()

        if (error) {
          console.error("Error updating cart item:", error)
          throw error
        }

        result = data
      } else {
        // Create new cart item
        const { data, error } = await supabase
          .from("cart_items")
          .insert({
            ngo_id: ngoId,
            food_item_id: foodItemId,
            quantity: quantity,
          })
          .select("*")
          .single()

        if (error) {
          console.error("Error adding to cart:", error)
          throw error
        }

        result = data
      }

      // Get food item details
      const { data: foodItem, error: foodError } = await supabase
        .from("food_items")
        .select("*")
        .eq("id", foodItemId)
        .single()

      if (foodError) {
        console.error("Error fetching food item for cart:", foodError)
        throw foodError
      }

      return mapCartItemFromSupabase(result, foodItem)
    } catch (error) {
      console.error("Failed to add to cart:", error)
      // Fallback to mock implementation
      const existingItem = mockCartItems.find((item) => item.ngoId === ngoId && item.foodItemId === foodItemId)

      if (existingItem) {
        existingItem.quantity += quantity
        return {
          ...existingItem,
          foodItem: mockFoodItems.find((food) => food.id === existingItem.foodItemId),
        }
      } else {
        const newItem: CartItem = {
          id: `mock-${Date.now()}`,
          ngoId,
          foodItemId,
          quantity,
          createdAt: new Date(),
        }

        const foodItem = mockFoodItems.find((food) => food.id === foodItemId)
        mockCartItems.push(newItem)

        return {
          ...newItem,
          foodItem,
        }
      }
    }
  },

  updateCartItem: async (id: string, quantity: number): Promise<CartItem | null> => {
    try {
      const { data, error } = await supabase.from("cart_items").update({ quantity }).eq("id", id).select("*").single()

      if (error) {
        console.error("Error updating cart item:", error)
        throw error
      }

      // Get food item details
      const { data: foodItem, error: foodError } = await supabase
        .from("food_items")
        .select("*")
        .eq("id", data.food_item_id)
        .single()

      if (foodError) {
        console.error("Error fetching food item for cart:", foodError)
        throw foodError
      }

      return mapCartItemFromSupabase(data, foodItem)
    } catch (error) {
      console.error("Failed to update cart item:", error)
      // Fallback to mock implementation
      const index = mockCartItems.findIndex((item) => item.id === id)
      if (index === -1) return null

      mockCartItems[index].quantity = quantity

      return {
        ...mockCartItems[index],
        foodItem: mockFoodItems.find((food) => food.id === mockCartItems[index].foodItemId),
      }
    }
  },

  removeFromCart: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", id)

      if (error) {
        console.error("Error removing from cart:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Failed to remove from cart:", error)
      // Fallback to mock implementation
      const index = mockCartItems.findIndex((item) => item.id === id)
      if (index === -1) return false

      mockCartItems.splice(index, 1)
      return true
    }
  },

  clearCart: async (ngoId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("ngo_id", ngoId)

      if (error) {
        console.error("Error clearing cart:", error)
        throw error
      }

      return true
    } catch (error) {
      console.error("Failed to clear cart:", error)
      // Fallback to mock implementation
      const cartItemsToKeep = mockCartItems.filter((item) => item.ngoId !== ngoId)
      mockCartItems.length = 0
      mockCartItems.push(...cartItemsToKeep)

      return true
    }
  },
}
