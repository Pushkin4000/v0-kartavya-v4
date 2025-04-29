
import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { cartService } from '@/lib/cart-service';
import { CartItem as CartItemType } from '@/lib/types';
import CartItem from '@/components/cart/CartItem';
import EmptyState from '@/components/common/EmptyState';

export default function CartPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Redirect if not logged in or not an NGO
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (user.userType !== 'ngo') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Load cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        const items = await cartService.getCartItems(user.id);
        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your cart. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);
  
  // Update item quantity
  const handleUpdateQuantity = async (id: string, quantity: number) => {
    try {
      const updatedItem = await cartService.updateCartItem(id, quantity);
      if (updatedItem) {
        setCartItems(prevItems => 
          prevItems.map(item => item.id === id ? updatedItem : item)
        );
        toast({
          title: 'Cart Updated',
          description: 'Item quantity has been updated.',
        });
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update item quantity. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Remove item from cart
  const handleRemoveItem = async (id: string) => {
    try {
      const success = await cartService.removeFromCart(id);
      if (success) {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        toast({
          title: 'Item Removed',
          description: 'Item has been removed from your cart.',
        });
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Your Cart</h1>
        <p className="text-gray-600">
          Review items and proceed to checkout when ready.
        </p>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 animate-pulse rounded-md h-24"
            />
          ))}
        </div>
      ) : cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Items ({cartItems.length})</h2>
              <div className="divide-y">
                {cartItems.map(item => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div>
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unique Food Types:</span>
                  <span>{cartItems.length}</span>
                </div>
              </div>
              <Button 
                className="w-full" 
                size="lg"
                asChild
              >
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full mt-2"
                asChild
              >
                <Link to="/browse">Continue Shopping</Link>
              </Button>
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
  );
}
