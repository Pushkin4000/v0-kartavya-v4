
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, ShoppingCart, Archive, Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PageLayout from '@/components/layout/PageLayout';
import { useAuth } from '@/lib/auth-context';
import OrderStatusBadge from '@/components/common/OrderStatusBadge';
import FoodCategoryBadge from '@/components/common/FoodCategoryBadge';
import ExpiryBadge from '@/components/common/ExpiryBadge';
import { mockFoodItems, mockOrders } from '@/lib/mock-data';

export default function DashboardPage() {
  const { user } = useAuth();
  
  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const isProvider = user.userType === 'provider';
  const isNgo = user.userType === 'ngo';
  
  // Get recent activities based on user type
  const getRecentFoodItems = () => {
    if (isProvider) {
      // Get food items created by this provider
      return mockFoodItems
        .filter(item => item.providerId === user.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
    } else {
      // For NGOs, show available food items
      return mockFoodItems
        .filter(item => item.status === 'available')
        .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())
        .slice(0, 3);
    }
  };
  
  const getRecentOrders = () => {
    if (isProvider) {
      // Get orders that include food items from this provider
      const providerOrderIds = new Set(
        mockOrders
          .filter(order => order.items?.some(item => item.providerId === user.id))
          .map(order => order.id)
      );
      
      return mockOrders
        .filter(order => providerOrderIds.has(order.id))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
    } else {
      // Get orders placed by this NGO
      return mockOrders
        .filter(order => order.ngoId === user.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 3);
    }
  };
  
  const recentFoodItems = getRecentFoodItems();
  const recentOrders = getRecentOrders();

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600">
          {isProvider 
            ? 'Manage your food donations and track orders from NGOs.' 
            : 'Browse available food items and manage your orders.'}
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {isProvider && (
          <>
            <Button 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link to="/new-listing">
                <Plus className="h-6 w-6 mb-1" />
                <span className="text-lg font-medium">Add Food Listing</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link to="/my-listings">
                <Package className="h-6 w-6 mb-1" />
                <span className="text-lg font-medium">View My Listings</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link to="/orders">
                <Archive className="h-6 w-6 mb-1" />
                <span className="text-lg font-medium">Manage Orders</span>
              </Link>
            </Button>
          </>
        )}
        
        {isNgo && (
          <>
            <Button 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link to="/browse">
                <Package className="h-6 w-6 mb-1" />
                <span className="text-lg font-medium">Browse Food</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link to="/cart">
                <ShoppingCart className="h-6 w-6 mb-1" />
                <span className="text-lg font-medium">View Cart</span>
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto py-6 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <Link to="/orders">
                <Calendar className="h-6 w-6 mb-1" />
                <span className="text-lg font-medium">View Orders</span>
              </Link>
            </Button>
          </>
        )}
      </div>
      
      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Food Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{isProvider ? 'My Recent Listings' : 'Available Food'}</span>
              <Button variant="ghost" size="sm" asChild>
                <Link to={isProvider ? '/my-listings' : '/browse'}>
                  View All
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              {isProvider 
                ? 'Your recently added food listings' 
                : 'Food items available for pickup'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentFoodItems.length > 0 ? (
              <ul className="space-y-4">
                {recentFoodItems.map(item => (
                  <li key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">
                          {item.quantity} {item.quantityUnit}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <FoodCategoryBadge category={item.category} />
                        <ExpiryBadge expiryDate={item.expiryDate} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 py-6 text-center">
                {isProvider 
                  ? 'You haven\'t created any food listings yet.' 
                  : 'No food items are currently available.'}
              </p>
            )}
          </CardContent>
          {recentFoodItems.length === 0 && (
            <CardFooter>
              {isProvider ? (
                <Button className="w-full" asChild>
                  <Link to="/new-listing">Add Food Listing</Link>
                </Button>
              ) : (
                <Button className="w-full" asChild>
                  <Link to="/browse">Check Back Later</Link>
                </Button>
              )}
            </CardFooter>
          )}
        </Card>
        
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Recent Orders</span>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/orders">
                  View All
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              {isProvider 
                ? 'Orders received for your food items' 
                : 'Your recent pickup orders'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <ul className="space-y-4">
                {recentOrders.map(order => (
                  <li key={order.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Order #{order.id}</h4>
                        <p className="text-sm text-gray-500">
                          Pickup: {new Date(order.pickupTime).toLocaleDateString()} {' '}
                          {new Date(order.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                        <p className="text-sm text-gray-500">
                          {isProvider ? `NGO: ${order.ngoName}` : ''}
                        </p>
                      </div>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 py-6 text-center">
                {isProvider 
                  ? 'You haven\'t received any orders yet.' 
                  : 'You haven\'t placed any orders yet.'}
              </p>
            )}
          </CardContent>
          {recentOrders.length === 0 && isNgo && (
            <CardFooter>
              <Button className="w-full" asChild>
                <Link to="/browse">Browse Food</Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
