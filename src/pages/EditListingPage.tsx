"use client"

import { useState, useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import PageLayout from "@/components/layout/PageLayout"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import FoodForm from "@/components/food/FoodForm"
import { foodService } from "@/lib/food-service"
import type { FoodItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2, AlertTriangle } from "lucide-react"

// First, import useQueryClient from React Query
import { useQueryClient } from "@tanstack/react-query"

export default function EditListingPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [foodItem, setFoodItem] = useState<FoodItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Then, inside the component, add this line after the other hooks:
  const queryClient = useQueryClient()

  // Redirect if not logged in or not a provider
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (user.userType !== "provider") {
    return <Navigate to="/dashboard" replace />
  }

  // Load food item data on component mount
  useEffect(() => {
    let isMounted = true // Add a flag to track component mount status

    const fetchFoodItem = async () => {
      if (!id) {
        toast({
          title: "Error",
          description: "Food item ID is missing.",
          variant: "destructive",
        })
        navigate("/my-listings")
        return
      }

      try {
        setIsLoading(true)
        const item = await foodService.getFoodItem(id)

        if (!item) {
          toast({
            title: "Error",
            description: "Food item not found.",
            variant: "destructive",
          })
          navigate("/my-listings")
          return
        }

        // Check if this food item belongs to the current user
        if (item.providerId !== user.id) {
          toast({
            title: "Access Denied",
            description: "You do not have permission to edit this item.",
            variant: "destructive",
          })
          navigate("/my-listings")
          return
        }

        if (isMounted) {
          setFoodItem(item)
        }
      } catch (error) {
        console.error("Error fetching food item:", error)
        toast({
          title: "Error",
          description: "Failed to load food item details. Please try again.",
          variant: "destructive",
        })
        navigate("/my-listings")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchFoodItem()

    return () => {
      isMounted = false // Set the flag to false when the component unmounts
    }
  }, [id, navigate, toast, user])

  // Now, update the handleSubmit function to invalidate the cache after updating a listing:
  const handleSubmit = async (data: Omit<FoodItem, "id" | "createdAt" | "status">) => {
    if (!id) return

    try {
      setIsSubmitting(true)

      await foodService.updateFoodItem(id, {
        ...data,
        providerId: user.id,
      })

      // Invalidate the foodItems query to force a refetch
      queryClient.invalidateQueries({ queryKey: ["foodItems"] })

      toast({
        title: "Success",
        description: "Food listing has been updated successfully.",
      })

      navigate("/my-listings")
    } catch (error) {
      console.error("Error updating food listing:", error)
      toast({
        title: "Error",
        description: "Failed to update food listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Also update the handleDelete function to invalidate the cache after deleting a listing:
  const handleDelete = async () => {
    if (!id) return

    try {
      setIsDeleting(true)

      const success = await foodService.deleteFoodItem(id)

      if (success) {
        // Invalidate the foodItems query to force a refetch
        queryClient.invalidateQueries({ queryKey: ["foodItems"] })

        toast({
          title: "Success",
          description: "Food listing has been deleted.",
        })

        navigate("/my-listings")
      } else {
        throw new Error("Failed to delete food item")
      }
    } catch (error) {
      console.error("Error deleting food listing:", error)
      toast({
        title: "Error",
        description: "Failed to delete food listing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <PageLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-2">Edit Food Listing</h1>
          <p className="text-gray-600">Update the details of your food donation.</p>
        </div>

        {foodItem && foodItem.status === "available" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Listing</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the food listing from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Listing"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : foodItem ? (
        <div className="max-w-2xl mx-auto">
          {foodItem.status !== "available" && (
            <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">This item is {foodItem.status}</p>
                  <p className="text-sm">
                    {foodItem.status === "claimed"
                      ? "This item has been claimed and cannot be modified extensively."
                      : "This item has expired and is no longer available for claiming."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <FoodForm onSubmit={handleSubmit} initialData={foodItem} isLoading={isSubmitting} providerId={user.id} />
        </div>
      ) : (
        <div className="text-center py-12">
          <p>Food item not found or you do not have permission to edit it.</p>
          <Button onClick={() => navigate("/my-listings")} className="mt-4">
            Back to My Listings
          </Button>
        </div>
      )}
    </PageLayout>
  )
}
