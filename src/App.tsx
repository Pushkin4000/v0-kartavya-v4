
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";

// Pages
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import BrowseFoodPage from "./pages/BrowseFoodPage";
import CartPage from "./pages/CartPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredUserType = null }) => {
  const storedUser = localStorage.getItem('kartavya_user');
  const isLoggedIn = !!storedUser;
  
  // Check if the user is logged in
  if (!isLoggedIn) {
    return <Navigate to="/auth" replace />;
  }
  
  // If a specific user type is required, check it
  if (requiredUserType) {
    const user = JSON.parse(storedUser);
    if (user.userType !== requiredUserType) {
      return <Navigate to="/dashboard" replace />;
    }
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes for all authenticated users */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            {/* Protected routes for NGOs */}
            <Route path="/browse" element={
              <ProtectedRoute requiredUserType="ngo">
                <BrowseFoodPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute requiredUserType="ngo">
                <CartPage />
              </ProtectedRoute>
            } />
            
            {/* Add other routes here */}
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
