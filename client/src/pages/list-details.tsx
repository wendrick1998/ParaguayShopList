import { useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ProductItem } from '@/components/product-item';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { realtimeService } from '@/lib/supabase';
import { ArrowLeft, MoreVertical, RefreshCw } from 'lucide-react';
import type { ShoppingList, ListItem } from '@shared/schema';

export default function ListDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: listData, isLoading, refetch } = useQuery<ShoppingList & { items: ListItem[] }>({
    queryKey: ['/api/shopping-lists', id],
    enabled: !!id,
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, updates }: { itemId: number; updates: Partial<ListItem> }) => {
      const response = await apiRequest('PATCH', `/api/list-items/${itemId}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-lists', id] });
      toast({
        title: "Item atualizado",
        description: "Status do item foi atualizado com sucesso",
      });
    },
  });

  // Set up real-time updates
  useEffect(() => {
    if (!id) return;

    const unsubscribe = realtimeService.subscribe(`list-${id}`, () => {
      refetch();
    });

    return unsubscribe;
  }, [id, refetch]);

  const handleGoBack = () => {
    setLocation('/dashboard');
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Lista atualizada",
      description: "Dados sincronizados com sucesso",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'processing':
        return 'Em Processamento';
      case 'active':
        return 'Ativa';
      default:
        return 'Rascunho';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Lista não encontrada</p>
          <Button onClick={handleGoBack}>Voltar</Button>
        </div>
      </div>
    );
  }

  const completedItems = listData.items.filter(item => item.status === 'purchased').length;
  const totalItems = listData.items.length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="p-1 text-white hover:bg-blue-700"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 text-white hover:bg-blue-700"
            >
              <MoreVertical className="w-6 h-6" />
            </Button>
          </div>
          <h1 className="text-xl font-bold mb-1">{listData.name}</h1>
          <div className="flex items-center space-x-4 text-blue-100">
            <span className="text-sm">{totalItems} itens</span>
            <span className="text-sm">{completedItems} comprados</span>
            <Badge className={getStatusColor(listData.status)}>
              {getStatusText(listData.status)}
            </Badge>
          </div>
        </div>

        {/* Real-time Status Bar */}
        <div className="bg-green-500 text-white px-6 py-2 text-sm flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
          Sincronização ativa - Atualizações em tempo real
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-white border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm text-gray-500">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {listData.items.map((item) => (
              <ProductItem
                key={item.id}
                item={item}
              />
            ))}
            
            {listData.items.length === 0 && (
              <div className="px-6 py-8 text-center">
                <p className="text-gray-500">Nenhum item nesta lista</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-6 bg-white border-t space-y-3">
          <Button
            onClick={handleRefresh}
            disabled={updateItemMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold"
          >
            {updateItemMutation.isPending ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Atualizando...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <RefreshCw className="w-5 h-5 mr-2" />
                Atualizar Lista
              </div>
            )}
          </Button>
          <div className="text-center text-xs text-gray-500">
            Última atualização: {new Date(listData.updatedAt).toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </div>
    </div>
  );
}
