import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Pages
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import CreateList from "@/pages/create-list";
import ListDetails from "@/pages/list-details";
import AdminProcessing from "@/pages/admin-processing";
import NotFound from "@/pages/not-found";

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return <>{children}</>;
}

function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user?.isAdmin) {
    return <Home />;
  }

  return <>{children}</>;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Home} />
          
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
        </>
      )}
      
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
