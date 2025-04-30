"use client"

import { useState, useEffect } from "react"
import { Navigate, useNavigate, useParams, Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageLayout from "@/components/layout/PageLayout"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { orderService } from "@/lib/order-service"
import type { Order, OrderStatus } from "@/lib/types"
import OrderStatusBadge from "@/components/common/OrderStatusBadge"
import FoodCategoryBadge from "@/components/common/FoodCategoryBadge"

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Load order details on component mount
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return

      try {
        setLoading(true)
        const data = await orderService.getOrder(id)

        if (!data) {
          toast({
            title: "Error",
            description: "Order not found.",
            variant: "destructive",
          })
          navigate("/orders")
          return
        }

        // Check if the user has access to this order
        if (user.userType === "ngo" && data.ngoId !== user.id) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to view this order.",
            variant: "destructive",
          })
          navigate("/orders")
          return
        }

        setOrder(data)
      } catch (error) {
        console.error("Error fetching order details:", error)
        toast({
          title: "Error",
          description: "Failed to load order details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleUpdateStatus = async (status: OrderStatus) => {
    if (!id || !order) return

    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status)
      if (updatedOrder) {
        setOrder(updatedOrder)

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

  // Function to format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    })
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link to="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Link>
        </Button>

        <h1 className="text-3xl font-heading font-bold mb-2">Order #{id ? id.slice(0, 8) : ""}</h1>
        <p className="text-gray-600">View details and manage order status.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="bg-gray-100 animate-pulse rounded-md h-16" />
          <div className="bg-gray-100 animate-pulse rounded-md h-64" />
        </div>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">NGO</h3>
                  <p className="mt-1 text-lg">{order.ngoName}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Placement Date</h3>
                  <p className="mt-1">{formatDate(order.createdAt)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
                  <p className="mt-1">{order.contactPerson}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Phone</h3>
                  <p className="mt-1">{order.contactPhone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Pickup Time</h3>
                  <p className="mt-1">{formatDate(order.pickupTime)}</p>
                </div>
              </div>

              {order.notes && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500">Additional Notes</h3>
                  <p className="mt-1 bg-gray-50 p-3 rounded-md text-gray-700">{order.notes}</p>
                </div>
              )}

              {/* Status update buttons for provider */}
              {user.userType === "provider" && (
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Update Order Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {order.status === "placed" && (
                      <Button onClick={() => handleUpdateStatus("confirmed")} size="sm">
                        Confirm Order
                      </Button>
                    )}

                    {(order.status === "placed" || order.status === "confirmed") && (
                      <Button onClick={() => handleUpdateStatus("ready")} size="sm">
                        Mark as Ready
                      </Button>
                    )}

                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <Button onClick={() => handleUpdateStatus("completed")} size="sm">
                        Complete Order
                      </Button>
                    )}

                    {order.status !== "completed" && order.status !== "cancelled" && (
                      <Button onClick={() => handleUpdateStatus("cancelled")} variant="destructive" size="sm">
                        Cancel Order
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Order Items</h2>

              <div className="divide-y">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.foodItem?.name}</h3>
                        <span className="font-medium">
                          {item.quantity} {item.foodItem?.quantityUnit}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-gray-600">{item.providerName}</p>
                        {item.foodItem && <FoodCategoryBadge category={item.foodItem.category} />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{order.items?.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Food Types:</span>
                  <span>{order.items?.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Providers:</span>
                  <span>{new Set(order.items?.map((item) => item.providerId)).size}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </PageLayout>
  )
}
