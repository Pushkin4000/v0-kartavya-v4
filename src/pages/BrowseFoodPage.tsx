
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/lib/auth-context';
import FoodCard from '@/components/food/FoodCard';
import { foodService } from '@/lib/food-service';
import { cartService } from '@/lib/cart-service';
import { FoodItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/common/EmptyState';

export default function BrowseFoodPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Redirect if not logged in or not an NGO
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (user.userType !== 'ngo') {
    return <Navigate to="/dashboard" replace />;
  }

  // Load food items on component mount
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching food items...");
        const items = await foodService.getAllFoodItems();
        console.log("Retrieved items:", items);
        setFoodItems(items);
        setFilteredItems(items);
      } catch (err) {
        console.error('Error fetching food items:', err);
        setError('Failed to load food listings. Please try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load food listings. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // Filter food items when search query or category filter changes
  useEffect(() => {
    let filtered = [...foodItems];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.description?.toLowerCase().includes(query) ||
        item.providerName?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    setFilteredItems(filtered);
  }, [searchQuery, categoryFilter, foodItems]);

  // Add item to cart
  const handleAddToCart = async (item: FoodItem) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'You must be logged in to add items to your cart.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await cartService.addToCart(user.id, item.id, 1);
      toast({
        title: 'Added to Cart',
        description: `${item.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Browse Food Listings</h1>
        <p className="text-gray-600">
          Find available food items and add them to your cart for pickup.
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
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
          <Select 
            value={categoryFilter} 
            onValueChange={setCategoryFilter}
          >
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
      </div>
      
      {/* Food items grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 animate-pulse rounded-md h-72"
            />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <FoodCard 
              key={item.id} 
              foodItem={item} 
              onAddToCart={() => handleAddToCart(item)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Food Items Found"
          description={
            searchQuery || categoryFilter !== 'all'
              ? "Try adjusting your search or filters to see more results."
              : "There are currently no food items available. Please check back later."
          }
          icon={<Package className="h-16 w-16" />}
          actionLabel={
            searchQuery || categoryFilter !== 'all'
              ? "Clear Filters"
              : undefined
          }
          onAction={() => {
            setSearchQuery('');
            setCategoryFilter('all');
          }}
        />
      )}
    </PageLayout>
  );
}
