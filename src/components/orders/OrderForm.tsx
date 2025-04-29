
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CartItem } from '@/lib/types';

// Set the minimum pickup time to 1 hour from now
const getMinPickupTime = () => {
  const date = new Date();
  date.setHours(date.getHours() + 1);
  // Format as YYYY-MM-DDTHH:MM
  return date.toISOString().slice(0, 16);
};

// Schema for order form
const formSchema = z.object({
  contactPerson: z.string().min(3, {
    message: 'Contact person name must be at least 3 characters.',
  }),
  contactPhone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  pickupTime: z.string().refine(val => {
    const pickupDate = new Date(val);
    const minDate = new Date();
    minDate.setHours(minDate.getHours() + 1);
    return pickupDate >= minDate;
  }, {
    message: 'Pickup time must be at least 1 hour from now.',
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface OrderFormProps {
  cartItems: CartItem[];
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export default function OrderForm({ cartItems, onSubmit, isSubmitting }: OrderFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactPerson: '',
      contactPhone: '',
      pickupTime: getMinPickupTime(),
      notes: '',
    },
  });

  // Count total items
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Your Order</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name of person picking up" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="pickupTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Time</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      min={getMinPickupTime()} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Any special instructions or requirements..." 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-medium mb-2">
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between font-medium mb-4">
                <span>Unique Food Types:</span>
                <span>{cartItems.length}</span>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || cartItems.length === 0}
              >
                {isSubmitting ? 'Processing...' : 'Place Order'}
              </Button>
              {cartItems.length === 0 && (
                <p className="text-sm text-red-500 text-center mt-2">
                  Your cart is empty. Add items before placing an order.
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
