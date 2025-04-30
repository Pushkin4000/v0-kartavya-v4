"use client"

import { useState, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { ShoppingCart } from "lucide-react"
import PageLayout from "@/components/layout/PageLayout"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { cartService } from "@/lib/cart-service"
import { orderService } from "@/lib/order-service"
import type { CartItem as CartItemType } from "@/lib/types"
import OrderForm from "@/components/orders/OrderForm"
import EmptyState from "@/components/common/EmptyState"

export default function CheckoutPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in or not an NGO
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (user.userType !== "ngo") {
    return <Navigate to="/dashboard" replace />
  }

  // Load cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true)
        const items = await cartService.getCartItems(user.id)
        setCartItems(items)
      } catch (error) {
        console.error("Error fetching cart items:", error)
        toast({
          title: "Error",
          description: "Failed to load your cart. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [])

  const handlePlaceOrder = async (formData: any) => {
    try {
      setIsSubmitting(true)

      // Create new order
      await orderService.createOrder(
        user.id,
        user.name,
        formData.contactPerson,
        formData.contactPhone,
        new Date(formData.pickupTime),
        formData.notes,
      )

      toast({
        title: "Order Placed",
        description: "Your order has been successfully placed.",
      })

      navigate("/orders")
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Checkout</h1>
        <p className="text-gray-600">Complete your order and provide pickup details.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse rounded-md h-24" />
          ))}
        </div>
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-2">
            <OrderForm cartItems={cartItems} onSubmit={handlePlaceOrder} isSubmitting={isSubmitting} />
          </div>

          {/* Cart Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.foodItem?.name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                    <div className="text-sm text-gray-600">{item.foodItem?.providerName}</div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total Items:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="Your Cart is Empty"
          description="You haven't added any food items to your cart yet."
          icon={<ShoppingCart className="h-16 w-16" />}
          actionLabel="Browse Food Items"
          actionLink="/browse"
        />
      )}
    </PageLayout>
  )
}
