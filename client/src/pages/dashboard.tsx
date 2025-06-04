import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ListItem } from '@/components/list-item';
import { BottomNavigation } from '@/components/bottom-navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import { User } from 'lucide-react';
import type { ShoppingList, ListItem as ListItemType } from '@shared/schema';

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();

  const { data: lists = [], isLoading } = useQuery<ShoppingList[]>({
    queryKey: ['/api/shopping-lists'],
  });

  // Calculate stats from lists
  const stats = {
    activeLists: lists.filter(list => list.status === 'active' || list.status === 'processing').length,
    completedItems: lists.filter(list => list.status === 'completed').length,
  };

  const handleCreateList = () => {
    setLocation('/create-list');
  };

  const handleViewList = (listId: number) => {
    setLocation(`/list/${listId}`);
  };

  const handleProfile = async () => {
    await logout();
    setLocation('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Minhas Listas</h1>
            <p className="text-blue-100 text-sm">{user?.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfile}
            className="p-2 hover:bg-blue-700 rounded-lg text-white"
          >
            <User className="w-6 h-6" />
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="shadow-sm border">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-primary">{stats.activeLists}</div>
                <div className="text-sm text-gray-600">Listas Ativas</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.completedItems}</div>
                <div className="text-sm text-gray-600">Listas Concluídas</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Shopping Lists */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Suas Listas</h2>
            <Button
              onClick={handleCreateList}
              className="bg-primary text-white px-4 py-2 rounded-lg font-medium"
            >
              + Nova Lista
            </Button>
          </div>

          <div className="space-y-3 mb-20">
            {lists.length === 0 ? (
              <Card className="shadow-sm">
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500 mb-4">Você ainda não tem listas de compras</p>
                  <Button onClick={handleCreateList} className="bg-primary text-white">
                    Criar sua primeira lista
                  </Button>
                </CardContent>
              </Card>
            ) : (
              lists.map((list) => (
                <ListItem
                  key={list.id}
                  list={list}
                  onView={() => handleViewList(list.id)}
                  onOptions={() => {}}
                />
              ))
            )}
          </div>
        </div>

        <BottomNavigation />
      </div>
    </div>
  );
}
