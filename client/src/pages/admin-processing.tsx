import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProductItem } from '@/components/product-item';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Check, X, Settings, RefreshCw } from 'lucide-react';
import type { ShoppingList, ListItem } from '@shared/schema';

interface ListWithItems extends ShoppingList {
  items: ListItem[];
}

export default function AdminProcessing() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: listsWithItems = [], isLoading, refetch } = useQuery<ListWithItems[]>({
    queryKey: ['/api/admin/shopping-lists-with-items'],
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: number; updates: Partial<ListItem> }) => {
      const response = await apiRequest('PATCH', `/api/list-items/${itemId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/shopping-lists-with-items'] });
    },
  });

  const handleMarkPurchased = async (item: ListItem) => {
    try {
      await updateItemMutation.mutateAsync({
        itemId: item.id,
        updates: {
          status: 'purchased',
          actualPrice: item.estimatedPrice || '0',
        },
      });
      toast({
        title: "Item marcado como comprado",
        description: `${item.name} foi marcado como comprado`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item",
        variant: "destructive",
      });
    }
  };

  const handleMarkCancelled = async (item: ListItem) => {
    try {
      await updateItemMutation.mutateAsync({
        itemId: item.id,
        updates: {
          status: 'cancelled',
          notes: 'Cancelado pelo administrador',
        },
      });
      toast({
        title: "Item cancelado",
        description: `${item.name} foi cancelado`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível cancelar o item",
        variant: "destructive",
      });
    }
  };

  const handleProcessAllAvailable = async (list: ListWithItems) => {
    const pendingItems = list.items.filter(item => item.status === 'pending');
    
    try {
      for (const item of pendingItems) {
        await updateItemMutation.mutateAsync({
          itemId: item.id,
          updates: {
            status: 'purchased',
            actualPrice: item.estimatedPrice || '0',
          },
        });
      }
      toast({
        title: "Todos os itens processados",
        description: `${pendingItems.length} itens foram marcados como comprados`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar todos os itens",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeLists = listsWithItems.filter(list => 
    list.status === 'active' || list.status === 'processing'
  );

  const totalItems = activeLists.reduce((sum, list) => sum + list.items.length, 0);
  const completedToday = activeLists.reduce((sum, list) => 
    sum + list.items.filter(item => 
      item.status === 'purchased' && 
      new Date(item.updatedAt).toDateString() === new Date().toDateString()
    ).length, 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold">Processamento Admin</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-100">Online</span>
            </div>
          </div>
          <p className="text-blue-100 text-sm">Listas ativas para processamento</p>
        </div>

        {/* Quick Stats */}
        <div className="p-6 bg-white border-b">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{activeLists.length}</div>
              <div className="text-xs text-gray-600">Listas Pendentes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{totalItems}</div>
              <div className="text-xs text-gray-600">Itens Totais</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{completedToday}</div>
              <div className="text-xs text-gray-600">Concluídos Hoje</div>
            </div>
          </div>
        </div>

        {/* Active Lists for Processing */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {activeLists.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500 mb-4">Nenhuma lista ativa para processamento</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            ) : (
              activeLists.map((list) => {
                const pendingItems = list.items.filter(item => item.status === 'pending');
                const purchasedItems = list.items.filter(item => item.status === 'purchased');
                
                return (
                  <div key={list.id} className="px-6 py-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{list.name}</h3>
                        <p className="text-sm text-gray-500">
                          {list.items.length} itens • Criada {new Date(list.createdAt).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Processando
                      </Badge>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex space-x-2 mb-3">
                      <Button
                        size="sm"
                        onClick={() => handleProcessAllAvailable(list)}
                        disabled={pendingItems.length === 0 || updateItemMutation.isPending}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        {updateItemMutation.isPending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          `Processar Disponíveis (${pendingItems.length})`
                        )}
                      </Button>
                    </div>

                    {/* Sample Items Preview */}
                    <div className="space-y-2">
                      {list.items.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-xs text-gray-500 ml-2">Qty: {item.quantity}</span>
                            {item.status !== 'pending' && (
                              <Badge 
                                className={`ml-2 text-xs ${
                                  item.status === 'purchased' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {item.status === 'purchased' ? 'Comprado' : 'Cancelado'}
                              </Badge>
                            )}
                          </div>
                          {item.status === 'pending' && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                onClick={() => handleMarkPurchased(item)}
                                disabled={updateItemMutation.isPending}
                                className="bg-green-500 hover:bg-green-600 text-white p-1.5 h-auto"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleMarkCancelled(item)}
                                disabled={updateItemMutation.isPending}
                                className="p-1.5 h-auto"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {list.items.length > 3 && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          ... e mais {list.items.length - 3} itens
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Admin Actions */}
        <div className="p-6 bg-white border-t">
          <div className="flex space-x-3">
            <Button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <div className="flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Sincronizar Tudo
                </div>
              )}
            </Button>
            <Button
              variant="outline"
              className="px-6 py-3 rounded-xl font-semibold"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
