
import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Package, LogIn, UserPlus } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import PageLayout from '@/components/layout/PageLayout';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

// Registration form schema
const registerSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  address: z.string().optional(),
  userType: z.enum(['provider', 'ngo']),
  // Conditional fields based on user type
  registrationNumber: z.string().optional(),
  peopleServed: z.number().optional(),
  providerType: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'register' ? 'register' : 'login';
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  // Registration form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      name: '',
      email: '',
      phone: '',
      address: '',
      userType: 'ngo',
    },
  });
  
  // Get the selected user type for conditional fields
  const selectedUserType = registerForm.watch('userType');

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const success = await login(data.username, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      const success = await register(data, data.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      className="bg-gray-50"
      containerClassName="max-w-lg py-12"
    >
      <div className="flex justify-center mb-6">
        <Link to="/" className="flex items-center">
          <Package 
            className="h-10 w-10 text-kartavya-primary" 
            strokeWidth={2} 
          />
          <span className="ml-2 font-heading font-bold text-2xl text-kartavya-dark">
            Kartavya
          </span>
        </Link>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>Register</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Login Tab Content */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login to Kartavya</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => setActiveTab('register')}
                className="text-sm"
              >
                Don't have an account? Register
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Register Tab Content */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>
                Join Kartavya to start sharing or receiving food resources.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="userType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>I am a</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="provider">Food Provider</SelectItem>
                            <SelectItem value="ngo">NGO / Charity</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Choose a username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Create a password" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {selectedUserType === 'provider' 
                            ? 'Business / Restaurant Name' 
                            : 'Organization Name'}
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={selectedUserType === 'provider' 
                              ? 'Enter business name' 
                              : 'Enter organization name'
                            } 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Your email address" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Contact number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={registerForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Conditional fields based on user type */}
                  {selectedUserType === 'provider' && (
                    <FormField
                      control={registerForm.control}
                      name="providerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="restaurant">Restaurant</SelectItem>
                              <SelectItem value="grocery">Grocery Store</SelectItem>
                              <SelectItem value="bakery">Bakery</SelectItem>
                              <SelectItem value="caterer">Caterer</SelectItem>
                              <SelectItem value="farm">Farm</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {selectedUserType === 'ngo' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="registrationNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Registration Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="NGO registration number" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="peopleServed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>People Served</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Approximate number" 
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                value={field.value || ''}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => setActiveTab('login')}
                className="text-sm"
              >
                Already have an account? Login
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
}
