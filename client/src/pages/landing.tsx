import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Check } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Paraguay Shopping Lists
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Manage international shopping lists with real-time collaboration for vendors and administrators
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="text-center">
              <ShoppingCart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Create Shopping Lists</CardTitle>
              <CardDescription>
                Vendors can create detailed shopping lists with product quantities and estimated prices
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Real-time Processing</CardTitle>
              <CardDescription>
                Administrators can process lists during shopping trips, marking items as purchased or cancelled
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/95 backdrop-blur">
            <CardHeader className="text-center">
              <Check className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Mobile Optimized</CardTitle>
              <CardDescription>
                Clean, mobile-first design optimized for iPhone with offline capabilities
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-white/95 backdrop-blur max-w-md mx-auto">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-semibold mb-4">Get Started</h3>
              <p className="text-gray-600 mb-6">
                Sign in with your account to start managing shopping lists
              </p>
              <Button 
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}