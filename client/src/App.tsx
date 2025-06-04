import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import CreateList from "@/pages/create-list";
import ListDetails from "@/pages/list-details";
import AdminProcessing from "@/pages/admin-processing";
import NotFound from "@/pages/not-found";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <>{children}</>;
}

function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      
      <Route path="/dashboard">
        <AuthWrapper>
          <Dashboard />
        </AuthWrapper>
      </Route>
      
      <Route path="/create-list">
        <AuthWrapper>
          <CreateList />
        </AuthWrapper>
      </Route>
      
      <Route path="/list/:id">
        {(params) => (
          <AuthWrapper>
            <ListDetails />
          </AuthWrapper>
        )}
      </Route>
      
      <Route path="/admin">
        <AuthWrapper>
          <AdminWrapper>
            <AdminProcessing />
          </AdminWrapper>
        </AuthWrapper>
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
