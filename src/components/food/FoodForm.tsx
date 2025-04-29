
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FoodItem, FoodCategory } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, {
    message: 'Name must be at least 3 characters.',
  }),
  category: z.enum(['prepared', 'grocery', 'produce', 'bakery', 'dairy', 'other']),
  quantity: z.coerce.number().positive({
    message: 'Quantity must be a positive number.',
  }),
  quantityUnit: z.string().min(1, {
    message: 'Unit is required.',
  }),
  expiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Please enter a valid date.',
  }),
  description: z.string().optional(),
  pickupInstructions: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface FoodFormProps {
  onSubmit: (data: Omit<FoodItem, 'id' | 'status' | 'createdAt'>) => void;
  initialData?: Partial<FoodItem>;
  isLoading?: boolean;
  providerId: string; // Changed from number to string
}

export default function FoodForm({
  onSubmit,
  initialData,
  isLoading = false,
  providerId,
}: FoodFormProps) {
  const { toast } = useToast();
  
  // Format date to YYYY-MM-DD format for input
  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || 'other',
      quantity: initialData?.quantity || 1,
      quantityUnit: initialData?.quantityUnit || 'kg',
      expiryDate: formatDateForInput(initialData?.expiryDate),
      description: initialData?.description || '',
      pickupInstructions: initialData?.pickupInstructions || '',
    },
  });

  const handleSubmit = (values: FormData) => {
    try {
      onSubmit({
        name: values.name,
        providerId: providerId,
        providerName: initialData?.providerName || '',
        category: values.category as FoodCategory,
        quantity: values.quantity,
        quantityUnit: values.quantityUnit,
        expiryDate: new Date(values.expiryDate),
        description: values.description,
        pickupInstructions: values.pickupInstructions,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialData?.id ? 'Edit Food Item' : 'Add New Food Item'}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Fresh Produce Box" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a clear, descriptive name for the food item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="prepared">Prepared Food</SelectItem>
                        <SelectItem value="grocery">Grocery</SelectItem>
                        <SelectItem value="produce">Produce</SelectItem>
                        <SelectItem value="bakery">Bakery</SelectItem>
                        <SelectItem value="dairy">Dairy</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormDescription>
                      When will this food expire?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantityUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., kg, boxes, portions" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide additional details about the food..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pickupInstructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Instructions (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Instructions for pickup..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : initialData?.id ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
