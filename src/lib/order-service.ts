import type { Order, OrderItem, OrderStatus } from "./types"
import { supabase } from "@/integrations/supabase/client"
import { mockOrders, mockOrderItems, mockFoodItems } from "./mock-data"
import { cartService } from "./cart-service"

// Helper function to map Supabase data to our app's Order type
const mapOrderFromSupabase = (order: any, orderItems: any[] = []): Order => {
  return {
    id: order.id,
    ngoId: order.ngo_id,
    ngoName: order.ngo_name,
    status: order.status,
    contactPerson: order.contact_person,
    contactPhone: order.contact_phone,
    pickupTime: new Date(order.pickup_time),
    notes: order.notes,
    createdAt: new Date(order.created_at),
    items: orderItems.map(mapOrderItemFromSupabase),
  }
}

// Helper function to map Supabase data to our app's OrderItem type
const mapOrderItemFromSupabase = (item: any): OrderItem => {
  return {
    id: item.id,
    orderId: item.order_id,
    foodItemId: item.food_item_id,
    providerId: item.provider_id,
    providerName: item.provider_name,
    quantity: item.quantity,
    foodItem: item.foodItem
      ? {
          id: item.foodItem.id,
          name: item.foodItem.name,
          providerId: item.foodItem.provider_id,
          providerName: item.foodItem.provider_name,
          category: item.foodItem.category,
          quantity: item.foodItem.quantity,
          quantityUnit: item.foodItem.quantity_unit,
          expiryDate: new Date(item.foodItem.expiry_date),
          description: item.foodItem.description,
          pickupInstructions: item.foodItem.pickup_instructions,
          status: item.foodItem.status,
          createdAt: new Date(item.foodItem.created_at),
        }
      : undefined,
  }
}

export const orderService = {
  getOrders: async (userId: string, userType: "provider" | "ngo"): Promise<Order[]> => {
    try {
      let orders

      if (userType === "ngo") {
        // For NGOs, get orders they've placed
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("ngo_id", userId)
          .order("created_at", { ascending: false })

        if (error) throw error
        orders = data
      } else {
        // For providers, get orders from order_items that contain their food items
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("provider_id", userId)

        if (itemsError) throw itemsError

        if (!orderItems || orderItems.length === 0) {
          return []
        }

        const orderIds = [...new Set(orderItems.map((item) => item.order_id))]

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .in("id", orderIds)
          .order("created_at", { ascending: false })

        if (ordersError) throw ordersError
        orders = ordersData
      }

      if (!orders || orders.length === 0) {
        return []
      }

      // Fetch order items for these orders
      const orderIds = orders.map((order) => order.id)

      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orderIds)

      if (itemsError) throw itemsError

      if (!orderItems) {
        return orders.map((order) => mapOrderFromSupabase(order, []))
      }

      // Get food items for the order items
      const foodItemIds = [...new Set(orderItems.map((item) => item.food_item_id))]

      const { data: foodItems, error: foodError } = await supabase.from("food_items").select("*").in("id", foodItemIds)

      if (foodError) throw foodError

      // Attach order items to each order
      return orders.map((order) => {
        const orderItemsForOrder = orderItems
          .filter((item) => item.order_id === order.id)
          .map((item) => {
            const foodItem = foodItems?.find((food) => food.id === item.food_item_id)
            return { ...item, foodItem }
          })

        return mapOrderFromSupabase(order, orderItemsForOrder)
      })
    } catch (error) {
      console.error("Failed to fetch orders:", error)
      // Fallback to mock implementation
      let filteredOrders

      if (userType === "ngo") {
        filteredOrders = mockOrders.filter((order) => order.ngoId === userId)
      } else {
        const providerOrderIds = new Set(
          mockOrderItems.filter((item) => item.providerId === userId).map((item) => item.orderId),
        )

        filteredOrders = mockOrders.filter((order) => providerOrderIds.has(order.id))
      }

      return filteredOrders.map((order) => ({
        ...order,
        items: mockOrderItems
          .filter((item) => item.orderId === order.id)
          .map((item) => ({
            ...item,
            foodItem: mockFoodItems.find((food) => food.id === item.foodItemId),
          })),
      }))
    }
  },

  getOrder: async (id: string): Promise<Order | null> => {
    try {
      const { data: order, error: orderError } = await supabase.from("orders").select("*").eq("id", id).single()

      if (orderError) throw orderError

      const { data: orderItems, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", id)

      if (itemsError) throw itemsError

      if (!orderItems || orderItems.length === 0) {
        return mapOrderFromSupabase(order, [])
      }

      const foodItemIds = orderItems.map((item) => item.food_item_id)

      const { data: foodItems, error: foodError } = await supabase.from("food_items").select("*").in("id", foodItemIds)

      if (foodError) throw foodError

      const orderItemsWithFood = orderItems.map((item) => {
        const foodItem = foodItems?.find((food) => food.id === item.food_item_id)
        return { ...item, foodItem }
      })

      return mapOrderFromSupabase(order, orderItemsWithFood)
    } catch (error) {
      console.error("Failed to fetch order:", error)
      // Fallback to mock implementation
      const order = mockOrders.find((order) => order.id === id)
      if (!order) return null

      return {
        ...order,
        items: mockOrderItems
          .filter((item) => item.orderId === id)
          .map((item) => ({
            ...item,
            foodItem: mockFoodItems.find((food) => food.id === item.foodItemId),
          })),
      }
    }
  },

  createOrder: async (
    ngoId: string,
    ngoName: string,
    contactPerson: string,
    contactPhone: string,
    pickupTime: Date,
    notes?: string,
  ): Promise<Order> => {
    try {
      // 1. Create the order
      const { data: newOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          ngo_id: ngoId,
          ngo_name: ngoName,
          contact_person: contactPerson,
          contact_phone: contactPhone,
          pickup_time: pickupTime.toISOString(),
          notes: notes,
          status: "placed",
        })
        .select("*")
        .single()

      if (orderError) throw orderError

      // 2. Get cart items
      const cartItems = await cartService.getCartItems(ngoId)

      if (cartItems.length === 0) {
        return mapOrderFromSupabase(newOrder, [])
      }

      // 3. Create order items
      const orderItemsToInsert = cartItems.map((cartItem) => {
        const foodItem = cartItem.foodItem!

        return {
          order_id: newOrder.id,
          food_item_id: cartItem.foodItemId,
          provider_id: foodItem.providerId,
          provider_name: foodItem.providerName || "",
          quantity: cartItem.quantity,
        }
      })

      const { data: createdOrderItems, error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItemsToInsert)
        .select("*")

      if (itemsError) throw itemsError

      // 4. Clear the cart
      await cartService.clearCart(ngoId)

      // Map order items with food items
      const orderItemsWithFood = createdOrderItems.map((item) => {
        const correspondingCartItem = cartItems.find((cartItem) => cartItem.foodItemId === item.food_item_id)

        return {
          ...item,
          foodItem: correspondingCartItem?.foodItem,
        }
      })

      return mapOrderFromSupabase(newOrder, orderItemsWithFood)
    } catch (error) {
      console.error("Failed to create order:", error)
      // Fallback to mock implementation
      const cartItems = await cartService.getCartItems(ngoId)

      const newOrder: Order = {
        id: `mock-${Date.now()}`,
        ngoId,
        ngoName,
        status: "placed",
        contactPerson,
        contactPhone,
        pickupTime,
        notes,
        createdAt: new Date(),
        items: [],
      }

      const orderItems: OrderItem[] = cartItems.map((cartItem, index) => {
        const foodItem = mockFoodItems.find((food) => food.id === cartItem.foodItemId)!

        return {
          id: `mock-item-${Date.now()}-${index}`,
          orderId: newOrder.id,
          foodItemId: cartItem.foodItemId,
          foodItem,
          providerId: foodItem.providerId,
          providerName: foodItem.providerName || "",
          quantity: cartItem.quantity,
        }
      })

      newOrder.items = orderItems

      mockOrders.push(newOrder)
      mockOrderItems.push(...orderItems)

      await cartService.clearCart(ngoId)

      return newOrder
    }
  },

  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order | null> => {
    try {
      const { data, error } = await supabase.from("orders").update({ status }).eq("id", id).select("*").single()

      if (error) throw error

      return orderService.getOrder(id)
    } catch (error) {
      console.error("Failed to update order status:", error)
      // Fallback to mock implementation
      const index = mockOrders.findIndex((order) => order.id === id)
      if (index === -1) return null

      mockOrders[index].status = status

      return {
        ...mockOrders[index],
        items: mockOrderItems
          .filter((item) => item.orderId === id)
          .map((item) => ({
            ...item,
            foodItem: mockFoodItems.find((food) => food.id === item.foodItemId),
          })),
      }
    }
  },
}
