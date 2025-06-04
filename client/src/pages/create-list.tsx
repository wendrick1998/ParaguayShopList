import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import type { InsertShoppingList, InsertListItem } from '@shared/schema';

interface ProductFormData {
  name: string;
  quantity: string;
  estimatedPrice: string;
}

interface Product extends ProductFormData {
  id: string;
}

export default function CreateList() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [listData, setListData] = useState({
    name: '',
    description: '',
  });

  const [productForm, setProductForm] = useState<ProductFormData>({
    name: '',
    quantity: '1',
    estimatedPrice: '',
  });

  const [products, setProducts] = useState<Product[]>([]);

  const createListMutation = useMutation({
    mutationFn: async (data: InsertShoppingList) => {
      const response = await apiRequest('POST', '/api/shopping-lists', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/shopping-lists'] });
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async ({ listId, item }: { listId: number; item: InsertListItem }) => {
      const response = await apiRequest('POST', `/api/shopping-lists/${listId}/items`, item);
      return response.json();
    },
  });

  const handleGoBack = () => {
    setLocation('/dashboard');
  };

  const handleAddProduct = () => {
    if (!productForm.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do produto é obrigatório",
        variant: "destructive",
      });
      return;
    }

    const newProduct: Product = {
      ...productForm,
      id: Date.now().toString(),
    };

    setProducts(prev => [...prev, newProduct]);
    setProductForm({
      name: '',
      quantity: '1',
      estimatedPrice: '',
    });
  };

  const handleRemoveProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const handleSaveList = async () => {
    if (!listData.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome da lista é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (products.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um produto à lista",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create the list
      const list = await createListMutation.mutateAsync({
        name: listData.name,
        description: listData.description || undefined,
        status: 'draft',
      });

      // Add all products to the list
      for (const product of products) {
        await createItemMutation.mutateAsync({
          listId: list.id,
          item: {
            listId: list.id,
            name: product.name,
            quantity: parseInt(product.quantity) || 1,
            estimatedPrice: product.estimatedPrice ? product.estimatedPrice : undefined,
            status: 'pending',
          },
        });
      }

      toast({
        title: "Lista criada com sucesso!",
        description: `"${list.name}" foi salva com ${products.length} produtos`,
      });

      setLocation('/dashboard');
    } catch (error: any) {
      toast({
        title: "Erro ao criar lista",
        description: error.message || "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const isLoading = createListMutation.isPending || createItemMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-primary text-white px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="p-1 text-white hover:bg-blue-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Nova Lista</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSaveList}
            disabled={isLoading}
            className="text-blue-100 font-medium hover:bg-blue-700"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Salvar'}
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* List Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome da Lista
              </Label>
              <Input
                id="name"
                type="text"
                value={listData.name}
                onChange={(e) => setListData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Lista Eletrônicos Janeiro"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <Label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </Label>
              <Textarea
                id="description"
                value={listData.description}
                onChange={(e) => setListData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Adicione detalhes sobre esta lista..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none h-20"
              />
            </div>
          </div>

          {/* Add Products Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Produtos</h3>
              <span className="text-sm text-gray-500">{products.length} itens</span>
            </div>

            {/* Add Product Form */}
            <Card className="mb-4">
              <CardContent className="p-4 bg-gray-50">
                <div className="space-y-3">
                  <Input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do produto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      min="1"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Quantidade"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                    <Input
                      type="text"
                      value={productForm.estimatedPrice}
                      onChange={(e) => setProductForm(prev => ({ ...prev, estimatedPrice: e.target.value }))}
                      placeholder="Preço estimado"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>

                  <Button
                    type="button"
                    onClick={handleAddProduct}
                    className="w-full bg-primary text-white py-2 rounded-lg font-medium text-sm"
                  >
                    Adicionar Produto
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            <div className="space-y-2">
              {products.map((product) => (
                <Card key={product.id} className="border border-gray-200">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {product.quantity}
                        {product.estimatedPrice && ` • ~$${product.estimatedPrice}`}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {products.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum produto adicionado ainda
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
