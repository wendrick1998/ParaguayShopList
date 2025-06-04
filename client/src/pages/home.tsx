import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { Plus, ShoppingCart, LogOut, Settings } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome,</span>
                <span className="font-medium text-gray-900">
                  {user?.firstName || user?.email || "User"}
                </span>
                {user?.isAdmin && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Admin
                  </Badge>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/create-list">
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed border-2 border-blue-300 bg-blue-50/50">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Plus className="h-12 w-12 text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-blue-900">Create New List</h3>
                  <p className="text-sm text-blue-700 text-center mt-2">
                    Start a new shopping list for your next trip
                  </p>
                </CardContent>
              </Card>
            </Link>

            {user?.isAdmin && (
              <Link href="/admin">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Settings className="h-12 w-12 text-orange-600 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
                    <p className="text-sm text-gray-600 text-center mt-2">
                      Process and manage active shopping lists
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )}
          </div>

          {/* Recent Lists */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Shopping Lists</h2>
            <Card>
              <CardHeader>
                <CardTitle>Recent Lists</CardTitle>
                <CardDescription>
                  Your most recent shopping lists will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg mb-2">No shopping lists yet</p>
                  <p className="text-sm">Create your first shopping list to get started</p>
                  <Link href="/create-list">
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create List
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}