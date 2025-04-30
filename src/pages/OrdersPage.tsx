"use client"

import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { Package } from "lucide-react"
import PageLayout from "@/components/layout/PageLayout"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { orderService } from "@/lib/order-service"
import type { Order, OrderStatus } from "@/lib/types"
import OrderCard from "@/components/orders/OrderCard"
import EmptyState from "@/components/common/EmptyState"

export default function OrdersPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Load orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await orderService.getOrders(user.id, user.userType)
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load orders. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status)
      if (updatedOrder) {
        setOrders((prevOrders) => prevOrders.map((order) => (order.id === id ? updatedOrder : order)))

        toast({
          title: "Status Updated",
          description: `Order status has been updated to ${status}.`,
        })
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          {user.userType === "ngo" ? "Your Orders" : "Incoming Orders"}
        </h1>
        <p className="text-gray-600">
          {user.userType === "ngo"
            ? "Track the status of your food pickup orders."
            : "Manage food pickup orders from NGOs."}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-100 animate-pulse rounded-md h-48" />
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} userType={user.userType} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={user.userType === "ngo" ? "No Orders Found" : "No Incoming Orders"}
          description={
            user.userType === "ngo" ? "You haven't placed any orders yet." : "You don't have any incoming orders yet."
          }
          icon={<Package className="h-16 w-16" />}
          actionLabel={user.userType === "ngo" ? "Browse Food Items" : undefined}
          actionLink={user.userType === "ngo" ? "/browse" : undefined}
        />
      )}
    </PageLayout>
  )
}
