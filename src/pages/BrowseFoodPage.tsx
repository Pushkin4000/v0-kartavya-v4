"use client"

import { useState, useEffect } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { Search, Package, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageLayout from "@/components/layout/PageLayout"
import { useAuth } from "@/lib/auth-context"
import FoodCard from "@/components/food/FoodCard"
import { foodService } from "@/lib/food-service"
import { cartService } from "@/lib/cart-service"
import type { FoodItem } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import EmptyState from "@/components/common/EmptyState"
import { useQuery } from "@tanstack/react-query"

export default function BrowseFoodPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Use React Query to fetch and cache food items with shorter staleTime
  const {
    data: foodItems = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["foodItems"],
    queryFn: async () => {
      console.log("Fetching food items with React Query...")
      try {
        const items = await foodService.getAllFoodItems()
        console.log("Food items fetched successfully:", items)
        return items
      } catch (error) {
        console.error("Error in queryFn:", error)
        throw error
      }
    },
    staleTime: 1000, // Consider data fresh for only 1 second to ensure frequent updates
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchInterval: 30000, // Automatically refetch every 30 seconds
  })

  // Redirect if not logged in or not an NGO
  if (!user) {
    return <Navigate to="/auth" replace />
  }

  if (user.userType !== "ngo") {
    return <Navigate to="/dashboard" replace />
  }

  // Filter food items when search query or category filter changes
  useEffect(() => {
    let filtered: FoodItem[] = [] // Initialize with an empty array

    if (foodItems) {
      filtered = [...foodItems]

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.description?.toLowerCase() || "").includes(query) ||
            (item.providerName?.toLowerCase() || "").includes(query),
        )
      }

      // Filter by category
      if (categoryFilter !== "all") {
        filtered = filtered.filter((item) => item.category === categoryFilter)
      }
    }

    setFilteredItems(filtered)
  }, [searchQuery, categoryFilter, foodItems])

  // Add item to cart
  const handleAddToCart = async (item: FoodItem) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add items to your cart.",
        variant: "destructive",
      })
      return
    }

    try {
      await cartService.addToCart(user.id, item.id, 1)
      toast({
        title: "Added to Cart",
        description: `${item.name} has been added to your cart.`,
      })
    } catch (error) {
      console.error("Error adding item to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await refetch()
      toast({
        title: "Refreshed",
        description: "Food listings have been refreshed.",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Browse Food Listings</h1>
        <p className="text-gray-600">Find available food items and add them to your cart for pickup.</p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search food items..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="prepared">Prepared Food</SelectItem>
              <SelectItem value="grocery">Grocery</SelectItem>
              <SelectItem value="produce">Produce</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={isRefreshing}>
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </>
          )}
        </Button>
      </div>

      {/* Food items grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading food items...</span>
        </div>
      ) : queryError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load food listings. Please try again.</p>
          <Button variant="outline" className="mt-4" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <FoodCard key={item.id} foodItem={item} onAddToCart={() => handleAddToCart(item)} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Food Items Found"
          description={
            searchQuery || categoryFilter !== "all"
              ? "Try adjusting your search or filters to see more results."
              : "There are currently no food items available. Please check back later."
          }
          icon={<Package className="h-16 w-16" />}
          actionLabel={searchQuery || categoryFilter !== "all" ? "Clear Filters" : "Refresh Listings"}
          onAction={() => {
            if (searchQuery || categoryFilter !== "all") {
              setSearchQuery("")
              setCategoryFilter("all")
            } else {
              handleRefresh()
            }
          }}
        />
      )}
    </PageLayout>
  )
}
